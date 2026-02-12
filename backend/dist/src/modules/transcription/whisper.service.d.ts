import OpenAI from 'openai';
export declare class WhisperService {
    private openai;
    constructor();
    transcribeAudio(audioFile: Express.Multer.File): Promise<string>;
    transcribeWithTimestamps(audioFile: Express.Multer.File): Promise<OpenAI.Audio.Transcriptions.TranscriptionVerbose & {
        _request_id?: string | null;
    }>;
}
