"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const whisper_service_1 = require("./whisper.service");
const ai_analysis_service_1 = require("./ai-analysis.service");
let TranscriptionService = class TranscriptionService {
    constructor(prisma, whisperService, aiAnalysisService) {
        this.prisma = prisma;
        this.whisperService = whisperService;
        this.aiAnalysisService = aiAnalysisService;
    }
    async startTranscription(consultationId, veterinarianId) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id: consultationId },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consulta não encontrada');
        }
        if (consultation.veterinarianId !== veterinarianId) {
            throw new common_1.ForbiddenException('Você não tem permissão para esta consulta');
        }
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
    async recordConsent(dto) {
        const transcript = await this.prisma.consultationTranscript.findFirst({
            where: { consultationId: dto.consultationId },
            orderBy: { createdAt: 'desc' },
        });
        if (!transcript) {
            throw new common_1.NotFoundException('Sessão de transcrição não encontrada');
        }
        return this.prisma.consultationTranscript.update({
            where: { id: transcript.id },
            data: { consentGiven: dto.consentGiven },
        });
    }
    async transcribeAudioChunk(audioFile, consultationId) {
        const transcribedText = await this.whisperService.transcribeAudio(audioFile);
        const session = await this.prisma.consultationTranscript.findFirst({
            where: { consultationId },
            orderBy: { createdAt: 'desc' },
        });
        if (!session) {
            throw new common_1.NotFoundException('Sessão de transcrição não encontrada');
        }
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
    async analyzeAndAutoCheck(dto) {
        const analysis = await this.aiAnalysisService.analyzeTranscript(dto.consultationId, dto.transcript);
        const updates = await Promise.all(analysis.itemsToCheck.map(async (item) => {
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
        }));
        await this.recalculateAdherence(dto.consultationId);
        return {
            itemsChecked: updates.filter(Boolean).length,
            analysis: analysis.fullAnalysis,
            items: analysis.itemsToCheck,
        };
    }
    async finishTranscription(consultationId, duration) {
        const session = await this.prisma.consultationTranscript.findFirst({
            where: { consultationId },
            orderBy: { createdAt: 'desc' },
        });
        if (!session) {
            throw new common_1.NotFoundException('Sessão não encontrada');
        }
        return this.prisma.consultationTranscript.update({
            where: { id: session.id },
            data: {
                finishedAt: new Date(),
                duration,
            },
        });
    }
    async getTranscription(consultationId) {
        return this.prisma.consultationTranscript.findFirst({
            where: { consultationId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async recalculateAdherence(consultationId) {
        const items = await this.prisma.consultationChecklist.findMany({
            where: { consultationId },
        });
        if (items.length === 0)
            return;
        const completed = items.filter((i) => i.completed).length;
        const percentage = Math.round((completed / items.length) * 100);
        await this.prisma.consultation.update({
            where: { id: consultationId },
            data: { adherencePercentage: percentage },
        });
    }
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
};
exports.TranscriptionService = TranscriptionService;
exports.TranscriptionService = TranscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        whisper_service_1.WhisperService,
        ai_analysis_service_1.AIAnalysisService])
], TranscriptionService);
//# sourceMappingURL=transcription.service.js.map