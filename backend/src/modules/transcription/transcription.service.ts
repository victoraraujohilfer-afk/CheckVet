import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AIAnalysisService } from './ai-analysis.service';
import { AnalyzeTranscriptDto, ConsentDto } from './dto/transcription.dto';

@Injectable()
export class TranscriptionService {
    constructor(
        private prisma: PrismaService,
        private aiAnalysisService: AIAnalysisService,
    ) { }

    /**
     * Valida que a consulta existe e pertence ao veterinário
     */
    private async validateOwnership(consultationId: string, veterinarianId: string) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id: consultationId },
        });

        if (!consultation) {
            throw new NotFoundException('Consulta não encontrada');
        }

        if (consultation.veterinarianId !== veterinarianId) {
            throw new ForbiddenException('Você não tem permissão para esta consulta');
        }

        return consultation;
    }

    /**
     * Inicia uma nova sessão de transcrição
     */
    async startTranscription(consultationId: string, veterinarianId: string) {
        await this.validateOwnership(consultationId, veterinarianId);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

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
    async recordConsent(dto: ConsentDto, veterinarianId: string) {
        await this.validateOwnership(dto.consultationId, veterinarianId);

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
     * Appende texto ao transcript ativo (chamado pelo Gateway em tempo real)
     */
    async appendTranscript(consultationId: string, text: string): Promise<string> {
        const session = await this.prisma.consultationTranscript.findFirst({
            where: { consultationId },
            orderBy: { createdAt: 'desc' },
        });

        if (!session) {
            throw new NotFoundException('Sessão de transcrição não encontrada');
        }

        const updatedTranscript = session.transcript
            ? `${session.transcript} ${text}`
            : text;

        await this.prisma.consultationTranscript.update({
            where: { id: session.id },
            data: { transcript: updatedTranscript },
        });

        return updatedTranscript;
    }

    /**
     * Analisa transcrição e auto-marca checklist
     */
    async analyzeAndAutoCheck(dto: AnalyzeTranscriptDto, veterinarianId: string) {
        await this.validateOwnership(dto.consultationId, veterinarianId);

        const analysis = await this.aiAnalysisService.analyzeTranscript(
            dto.consultationId,
            dto.transcript,
        );

        const updates = await Promise.all(
            analysis.itemsToCheck.map(async (item) => {
                const checklistItem = await this.prisma.consultationChecklist.findFirst({
                    where: {
                        consultationId: dto.consultationId,
                        protocolItemId: item.itemId,
                    },
                });

                if (!checklistItem) {
                    return null;
                }

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
    async finishTranscription(consultationId: string, duration: number, veterinarianId: string) {
        await this.validateOwnership(consultationId, veterinarianId);

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
    async getTranscription(consultationId: string, veterinarianId: string) {
        await this.validateOwnership(consultationId, veterinarianId);

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
     * Limpa transcrições expiradas (chamado via CRON)
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
