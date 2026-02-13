import { PrismaService } from '../../prisma/prisma.service';
import { AIAnalysisService } from './ai-analysis.service';
import { AnalyzeTranscriptDto, ConsentDto } from './dto/transcription.dto';
export declare class TranscriptionService {
    private prisma;
    private aiAnalysisService;
    constructor(prisma: PrismaService, aiAnalysisService: AIAnalysisService);
    private validateOwnership;
    startTranscription(consultationId: string, veterinarianId: string): Promise<{
        id: string;
        transcript: string;
        audioUrl: string | null;
        duration: number | null;
        consentGiven: boolean;
        startedAt: Date;
        finishedAt: Date | null;
        createdAt: Date;
        expiresAt: Date;
        consultationId: string;
    }>;
    recordConsent(dto: ConsentDto, veterinarianId: string): Promise<{
        id: string;
        transcript: string;
        audioUrl: string | null;
        duration: number | null;
        consentGiven: boolean;
        startedAt: Date;
        finishedAt: Date | null;
        createdAt: Date;
        expiresAt: Date;
        consultationId: string;
    }>;
    appendTranscript(consultationId: string, text: string): Promise<string>;
    analyzeAndAutoCheck(dto: AnalyzeTranscriptDto, veterinarianId: string): Promise<{
        itemsChecked: number;
        analysis: string;
        items: {
            itemId: string;
            confidence: number;
            reasoning: string;
            transcript: string;
        }[];
    }>;
    finishTranscription(consultationId: string, duration: number, veterinarianId: string): Promise<{
        id: string;
        transcript: string;
        audioUrl: string | null;
        duration: number | null;
        consentGiven: boolean;
        startedAt: Date;
        finishedAt: Date | null;
        createdAt: Date;
        expiresAt: Date;
        consultationId: string;
    }>;
    getTranscription(consultationId: string, veterinarianId: string): Promise<{
        id: string;
        transcript: string;
        audioUrl: string | null;
        duration: number | null;
        consentGiven: boolean;
        startedAt: Date;
        finishedAt: Date | null;
        createdAt: Date;
        expiresAt: Date;
        consultationId: string;
    } | null>;
    private recalculateAdherence;
    cleanupExpiredTranscripts(): Promise<{
        deletedCount: number;
    }>;
}
