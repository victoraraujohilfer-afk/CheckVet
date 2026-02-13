import type { ListenLiveClient } from '@deepgram/sdk';
export interface DeepgramCallbacks {
    onOpen: () => void;
    onTranscript: (text: string, isFinal: boolean) => void;
    onError: (error: Error) => void;
    onClose: () => void;
}
export declare class DeepgramService {
    private readonly logger;
    private client;
    constructor();
    createLiveConnection(callbacks: DeepgramCallbacks): ListenLiveClient;
    sendAudio(connection: ListenLiveClient, audioData: Buffer): void;
    closeConnection(connection: ListenLiveClient): void;
}
