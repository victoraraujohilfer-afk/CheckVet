import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DeepgramService } from './deepgram.service';
import { TranscriptionService } from './transcription.service';
import type { ListenLiveClient } from '@deepgram/sdk';

interface ActiveSession {
    deepgramConnection: ListenLiveClient;
    consultationId: string;
    veterinarianId: string;
    transcriptBuffer: string;
    finalSentenceCount: number;
}

@WebSocketGateway({
    namespace: '/transcription',
    cors: {
        origin: '*',
        credentials: true,
    },
})
export class TranscriptionGateway implements OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(TranscriptionGateway.name);
    private sessions = new Map<string, ActiveSession>();

    constructor(
        private deepgramService: DeepgramService,
        private transcriptionService: TranscriptionService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    /**
     * Quando o socket desconecta, limpa a sessão
     */
    handleDisconnect(client: Socket) {
        this.cleanupSession(client.id);
    }

    /**
     * Frontend emite 'start-stream' para iniciar streaming de áudio
     */
    @SubscribeMessage('start-stream')
    async handleStartStream(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { consultationId: string; token: string },
    ) {
        try {
            // 1. Validar JWT
            const payload = this.jwtService.verify(data.token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
            const veterinarianId = payload.sub;

            // 2. Abrir conexão com Deepgram
            const deepgramConnection = this.deepgramService.createLiveConnection({
                onOpen: () => {
                    client.emit('stream-ready');
                },
                onTranscript: (text, isFinal) => {
                    client.emit('transcript', { text, isFinal });

                    // Acumula texto final no buffer
                    if (isFinal) {
                        const session = this.sessions.get(client.id);
                        if (session) {
                            session.transcriptBuffer = session.transcriptBuffer
                                ? `${session.transcriptBuffer} ${text}`
                                : text;
                            session.finalSentenceCount += 1;

                            // Salva no banco a cada 5 frases finais
                            if (session.finalSentenceCount % 5 === 0) {
                                this.transcriptionService
                                    .appendTranscript(session.consultationId, session.transcriptBuffer)
                                    .catch((err) => this.logger.error('Erro ao salvar transcript:', err));
                            }
                        }
                    }
                },
                onError: (error) => {
                    client.emit('error', { message: error.message });
                },
                onClose: () => {},
            });

            // 3. Armazenar sessão ativa
            this.sessions.set(client.id, {
                deepgramConnection,
                consultationId: data.consultationId,
                veterinarianId,
                transcriptBuffer: '',
                finalSentenceCount: 0,
            });

            this.logger.log(`Stream iniciado para consulta ${data.consultationId}`);
        } catch (error) {
            this.logger.error('Erro ao iniciar stream:', error);
            client.emit('error', { message: 'Erro ao iniciar transcrição em tempo real' });
        }
    }

    /**
     * Frontend emite 'audio-chunk' com dados de áudio bruto
     */
    @SubscribeMessage('audio-chunk')
    handleAudioChunk(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: ArrayBuffer,
    ) {
        const session = this.sessions.get(client.id);
        if (!session) return;

        const buffer = Buffer.from(data);
        this.deepgramService.sendAudio(session.deepgramConnection, buffer);
    }

    /**
     * Frontend emite 'stop-stream' para encerrar o streaming
     */
    @SubscribeMessage('stop-stream')
    async handleStopStream(@ConnectedSocket() client: Socket) {
        const session = this.sessions.get(client.id);
        if (!session) return;

        // Salva transcript final no banco
        if (session.transcriptBuffer) {
            try {
                await this.transcriptionService.appendTranscript(
                    session.consultationId,
                    session.transcriptBuffer,
                );
            } catch (err) {
                this.logger.error('Erro ao salvar transcript final:', err);
            }
        }

        // Fecha Deepgram e limpa sessão
        this.cleanupSession(client.id);
        client.emit('stream-stopped');
    }

    /**
     * Limpa sessão e fecha conexão Deepgram
     */
    private cleanupSession(socketId: string) {
        const session = this.sessions.get(socketId);
        if (session) {
            this.deepgramService.closeConnection(session.deepgramConnection);
            this.sessions.delete(socketId);
            this.logger.log(`Sessão limpa para socket ${socketId}`);
        }
    }
}
