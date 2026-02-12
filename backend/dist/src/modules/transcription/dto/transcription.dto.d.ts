export declare class StartTranscriptionDto {
    consultationId: string;
}
export declare class TranscribeAudioDto {
    audio: Express.Multer.File;
    consultationId: string;
}
export declare class AnalyzeTranscriptDto {
    transcript: string;
    consultationId: string;
}
export declare class ConsentDto {
    consultationId: string;
    consentGiven: boolean;
}
export declare class ChecklistAnalysisResponse {
    itemsToCheck: {
        itemId: string;
        confidence: number;
        reasoning: string;
    }[];
    fullAnalysis: string;
}
