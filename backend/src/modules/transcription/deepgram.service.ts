import { Injectable, Logger } from '@nestjs/common';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import type { ListenLiveClient } from '@deepgram/sdk';

export interface DeepgramCallbacks {
    onOpen: () => void;
    onTranscript: (text: string, isFinal: boolean) => void;
    onError: (error: Error) => void;
    onClose: () => void;
}

@Injectable()
export class DeepgramService {
    private readonly logger = new Logger(DeepgramService.name);
    private client: ReturnType<typeof createClient>;

    constructor() {
        this.client = createClient(process.env.DEEPGRAM_API_KEY);
    }

    /**
     * Cria conexão live com Deepgram Nova-3 para streaming de áudio
     */
    createLiveConnection(callbacks: DeepgramCallbacks): ListenLiveClient {
        const connection = this.client.listen.live({
            model: 'nova-3',
            language: 'pt-BR',
            smart_format: true,
            punctuate: true,
            interim_results: true,
            endpointing: 300,
        });

        connection.on(LiveTranscriptionEvents.Open, () => {
            this.logger.log('Deepgram: conexão aberta — pronto para receber áudio');
            callbacks.onOpen();
        });

        connection.on(LiveTranscriptionEvents.Transcript, (data: any) => {
            const transcript = data.channel?.alternatives?.[0]?.transcript;
            if (transcript && transcript.trim().length > 0) {
                const isFinal = data.is_final === true;
                callbacks.onTranscript(transcript, isFinal);
            }
        });

        connection.on(LiveTranscriptionEvents.Error, (error: any) => {
            this.logger.error('Deepgram error:', error);
            callbacks.onError(new Error(error?.message || 'Erro no Deepgram'));
        });

        connection.on(LiveTranscriptionEvents.Close, () => {
            this.logger.log('Deepgram: conexão fechada');
            callbacks.onClose();
        });

        return connection;
    }

    /**
     * Envia chunk de áudio para o Deepgram
     */
    sendAudio(connection: ListenLiveClient, audioData: Buffer): void {
        try {
            // Converte Buffer para ArrayBuffer (tipo esperado pelo Deepgram SDK)
            const arrayBuffer = audioData.buffer.slice(
                audioData.byteOffset,
                audioData.byteOffset + audioData.byteLength,
            );
            connection.send(arrayBuffer);
        } catch (error) {
            this.logger.error('Erro ao enviar áudio ao Deepgram:', error);
        }
    }

    /**
     * Fecha conexão com o Deepgram
     */
    closeConnection(connection: ListenLiveClient): void {
        try {
            connection.requestClose();
        } catch (error) {
            this.logger.error('Erro ao fechar conexão Deepgram:', error);
        }
    }
}
