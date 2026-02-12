import { TranscriptionService } from './transcription.service';
import { AnalyzeTranscriptDto, ConsentDto, StartTranscriptionDto } from './dto/transcription.dto';
export declare class TranscriptionController {
    private readonly transcriptionService;
    constructor(transcriptionService: TranscriptionService);
    startTranscription(dto: StartTranscriptionDto, userId: string): Promise<{
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
    uploadAudio(file: Express.Multer.File, consultationId: string): Promise<{
        transcribedText: string;
        fullTranscript: string;
    }>;
    analyzeTranscript(dto: AnalyzeTranscriptDto): Promise<{
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
}
