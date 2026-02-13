import { TranscriptionService } from './transcription.service';
export declare class TranscriptionCleanupCron {
    private readonly transcriptionService;
    private readonly logger;
    constructor(transcriptionService: TranscriptionService);
    handleCleanup(): Promise<void>;
}
