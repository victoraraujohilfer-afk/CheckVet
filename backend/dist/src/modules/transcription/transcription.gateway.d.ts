import { OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DeepgramService } from './deepgram.service';
import { TranscriptionService } from './transcription.service';
export declare class TranscriptionGateway implements OnGatewayDisconnect {
    private deepgramService;
    private transcriptionService;
    private jwtService;
    private configService;
    server: Server;
    private readonly logger;
    private sessions;
    constructor(deepgramService: DeepgramService, transcriptionService: TranscriptionService, jwtService: JwtService, configService: ConfigService);
    handleDisconnect(client: Socket): void;
    handleStartStream(client: Socket, data: {
        consultationId: string;
        token: string;
    }): Promise<void>;
    handleAudioChunk(client: Socket, data: ArrayBuffer): void;
    handleStopStream(client: Socket): Promise<void>;
    private cleanupSession;
}
