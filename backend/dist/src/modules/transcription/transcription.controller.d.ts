import { TranscriptionService } from './transcription.service';
import { AnalyzeTranscriptDto, ConsentDto, StartTranscriptionDto } from './dto/transcription.dto';
export declare class TranscriptionController {
    private readonly transcriptionService;
    constructor(transcriptionService: TranscriptionService);
    startTranscription(dto: StartTranscriptionDto, userId: string): Promise<{
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
    recordConsent(dto: ConsentDto, userId: string): Promise<{
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
    getTranscription(consultationId: string, userId: string): Promise<{
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
}
