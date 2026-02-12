import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WhisperService } from './whisper.service';
import { AIAnalysisService } from './ai-analysis.service';
import { AnalyzeTranscriptDto, ConsentDto } from './dto/transcription.dto';

@Injectable()
export class TranscriptionService {
    constructor(
        private prisma: PrismaService,
        private whisperService: WhisperService,
        private aiAnalysisService: AIAnalysisService,
    ) { }

    /**
     * Inicia uma nova sessão de transcrição
     */
    async startTranscription(consultationId: string, veterinarianId: string) {
        // Verifica se consulta existe e pertence ao vet
        const consultation = await this.prisma.consultation.findUnique({
            where: { id: consultationId },
        });

        if (!consultation) {
            throw new NotFoundException('Consulta não encontrada');
        }

        if (consultation.veterinarianId !== veterinarianId) {
            throw new ForbiddenException('Você não tem permissão para esta consulta');
        }

        // Cria registro de transcrição
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 dias

        const transcript = await this.prisma.consultationTranscript.create({
            data: {
                consultationId,
                transcript: '',
                duration: 0,
                consentGiven: false,
                expiresAt,
            },
        });

        return transcript;
    }

    /**
     * Registra consentimento LGPD
     */
    async recordConsent(dto: ConsentDto) {
        const transcript = await this.prisma.consultationTranscript.findFirst({
            where: { consultationId: dto.consultationId },
            orderBy: { createdAt: 'desc' },
        });

        if (!transcript) {
            throw new NotFoundException('Sessão de transcrição não encontrada');
        }

        return this.prisma.consultationTranscript.update({
            where: { id: transcript.id },
            data: { consentGiven: dto.consentGiven },
        });
    }

    /**
     * Transcreve chunk de áudio
     */
    async transcribeAudioChunk(audioFile: Express.Multer.File, consultationId: string) {
        // 1. Transcrever com Whisper
        const transcribedText = await this.whisperService.transcribeAudio(audioFile);

        // 2. Buscar sessão de transcrição ativa
        const session = await this.prisma.consultationTranscript.findFirst({
            where: { consultationId },
            orderBy: { createdAt: 'desc' },
        });

        if (!session) {
            throw new NotFoundException('Sessão de transcrição não encontrada');
        }

        // 3. Append ao texto existente
        const updatedTranscript = session.transcript
            ? `${session.transcript} ${transcribedText}`
            : transcribedText;

        await this.prisma.consultationTranscript.update({
            where: { id: session.id },
            data: { transcript: updatedTranscript },
        });

        return {
            transcribedText,
            fullTranscript: updatedTranscript,
        };
    }

    /**
     * Analisa transcrição e auto-marca checklist
     */
    async analyzeAndAutoCheck(dto: AnalyzeTranscriptDto) {
        // 1. Analisar com IA
        const analysis = await this.aiAnalysisService.analyzeTranscript(
            dto.consultationId,
            dto.transcript,
        );

        // 2. Auto-marcar items identificados
        const updates = await Promise.all(
            analysis.itemsToCheck.map(async (item) => {
                // Busca o checklist item
                const checklistItem = await this.prisma.consultationChecklist.findFirst({
                    where: {
                        consultationId: dto.consultationId,
                        protocolItemId: item.itemId,
                    },
                });

                if (!checklistItem) {
                    return null;
                }

                // Atualiza com dados da IA
                return this.prisma.consultationChecklist.update({
                    where: { id: checklistItem.id },
                    data: {
                        completed: true,
                        completedAt: new Date(),
                        autoChecked: true,
                        aiTranscript: item.transcript,
                        aiConfidence: item.confidence,
                        notes: item.reasoning,
                    },
                });
            }),
        );

        // 3. Recalcular aderência
        await this.recalculateAdherence(dto.consultationId);

        return {
            itemsChecked: updates.filter(Boolean).length,
            analysis: analysis.fullAnalysis,
            items: analysis.itemsToCheck,
        };
    }

    /**
     * Finaliza transcrição
     */
    async finishTranscription(consultationId: string, duration: number) {
        const session = await this.prisma.consultationTranscript.findFirst({
            where: { consultationId },
            orderBy: { createdAt: 'desc' },
        });

        if (!session) {
            throw new NotFoundException('Sessão não encontrada');
        }

        return this.prisma.consultationTranscript.update({
            where: { id: session.id },
            data: {
                finishedAt: new Date(),
                duration,
            },
        });
    }

    /**
     * Buscar transcrição de uma consulta
     */
    async getTranscription(consultationId: string) {
        return this.prisma.consultationTranscript.findFirst({
            where: { consultationId },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Recalcula aderência ao protocolo
     */
    private async recalculateAdherence(consultationId: string) {
        const items = await this.prisma.consultationChecklist.findMany({
            where: { consultationId },
        });

        if (items.length === 0) return;

        const completed = items.filter((i) => i.completed).length;
        const percentage = Math.round((completed / items.length) * 100);

        await this.prisma.consultation.update({
            where: { id: consultationId },
            data: { adherencePercentage: percentage },
        });
    }

    /**
     * Limpa transcrições expiradas (rodar via CRON)
     */
    async cleanupExpiredTranscripts() {
        const deleted = await this.prisma.consultationTranscript.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });

        return { deletedCount: deleted.count };
    }
}