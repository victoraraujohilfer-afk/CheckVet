import { PrismaService } from '../../prisma/prisma.service';
import { WhisperService } from './whisper.service';
import { AIAnalysisService } from './ai-analysis.service';
import { AnalyzeTranscriptDto, ConsentDto } from './dto/transcription.dto';
export declare class TranscriptionService {
    private prisma;
    private whisperService;
    private aiAnalysisService;
    constructor(prisma: PrismaService, whisperService: WhisperService, aiAnalysisService: AIAnalysisService);
    startTranscription(consultationId: string, veterinarianId: string): Promise<{
        id: string;
        createdAt: Date;
        consultationId: string;
        duration: number | null;
        transcript: string;
        consentGiven: boolean;
        audioUrl: string | null;
        startedAt: Date;
        finishedAt: Date | null;
        expiresAt: Date;
    }>;
    recordConsent(dto: ConsentDto): Promise<{
        id: string;
        createdAt: Date;
        consultationId: string;
        duration: number | null;
        transcript: string;
        consentGiven: boolean;
        audioUrl: string | null;
        startedAt: Date;
        finishedAt: Date | null;
        expiresAt: Date;
    }>;
    transcribeAudioChunk(audioFile: Express.Multer.File, consultationId: string): Promise<{
        transcribedText: string;
        fullTranscript: string;
    }>;
    analyzeAndAutoCheck(dto: AnalyzeTranscriptDto): Promise<{
        itemsChecked: number;
        analysis: string;
        items: {
            itemId: string;
            confidence: number;
            reasoning: string;
            transcript: string;
        }[];
    }>;
    finishTranscription(consultationId: string, duration: number): Promise<{
        id: string;
        createdAt: Date;
        consultationId: string;
        duration: number | null;
        transcript: string;
        consentGiven: boolean;
        audioUrl: string | null;
        startedAt: Date;
        finishedAt: Date | null;
        expiresAt: Date;
    }>;
    getTranscription(consultationId: string): Promise<{
        id: string;
        createdAt: Date;
        consultationId: string;
        duration: number | null;
        transcript: string;
        consentGiven: boolean;
        audioUrl: string | null;
        startedAt: Date;
        finishedAt: Date | null;
        expiresAt: Date;
    } | null>;
    private recalculateAdherence;
    cleanupExpiredTranscripts(): Promise<{
        deletedCount: number;
    }>;
}
