import { TranscriptionService } from './transcription.service';
import { AnalyzeTranscriptDto, ConsentDto, StartTranscriptionDto } from './dto/transcription.dto';
export declare class TranscriptionController {
    private readonly transcriptionService;
    constructor(transcriptionService: TranscriptionService);
    startTranscription(dto: StartTranscriptionDto, userId: string): Promise<{
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
    recordConsent(dto: ConsentDto, userId: string): Promise<{
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
    analyzeTranscript(dto: AnalyzeTranscriptDto, userId: string): Promise<{
        itemsChecked: number;
        analysis: string;
        items: {
            itemId: string;
            confidence: number;
            reasoning: string;
            transcript: string;
        }[];
    }>;
    finishTranscription(consultationId: string, duration: number, userId: string): Promise<{
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
    getTranscription(consultationId: string, userId: string): Promise<{
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
}
