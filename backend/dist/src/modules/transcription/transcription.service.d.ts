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
        createdAt: Date;
        consultationId: string;
        transcript: string;
        consentGiven: boolean;
        audioUrl: string | null;
        duration: number | null;
        startedAt: Date;
        finishedAt: Date | null;
        expiresAt: Date;
    }>;
    recordConsent(dto: ConsentDto, veterinarianId: string): Promise<{
        id: string;
        createdAt: Date;
        consultationId: string;
        transcript: string;
        consentGiven: boolean;
        audioUrl: string | null;
        duration: number | null;
        startedAt: Date;
        finishedAt: Date | null;
        expiresAt: Date;
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
        createdAt: Date;
        consultationId: string;
        transcript: string;
        consentGiven: boolean;
        audioUrl: string | null;
        duration: number | null;
        startedAt: Date;
        finishedAt: Date | null;
        expiresAt: Date;
    }>;
    getTranscription(consultationId: string, veterinarianId: string): Promise<{
        id: string;
        createdAt: Date;
        consultationId: string;
        transcript: string;
        consentGiven: boolean;
        audioUrl: string | null;
        duration: number | null;
        startedAt: Date;
        finishedAt: Date | null;
        expiresAt: Date;
    } | null>;
    private recalculateAdherence;
    cleanupExpiredTranscripts(): Promise<{
        deletedCount: number;
    }>;
}
