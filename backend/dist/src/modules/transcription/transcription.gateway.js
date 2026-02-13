"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TranscriptionGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptionGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const deepgram_service_1 = require("./deepgram.service");
const transcription_service_1 = require("./transcription.service");
let TranscriptionGateway = TranscriptionGateway_1 = class TranscriptionGateway {
    constructor(deepgramService, transcriptionService, jwtService, configService) {
        this.deepgramService = deepgramService;
        this.transcriptionService = transcriptionService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(TranscriptionGateway_1.name);
        this.sessions = new Map();
    }
    handleDisconnect(client) {
        this.cleanupSession(client.id);
    }
    async handleStartStream(client, data) {
        try {
            const payload = this.jwtService.verify(data.token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            const veterinarianId = payload.sub;
            const deepgramConnection = this.deepgramService.createLiveConnection({
                onOpen: () => {
                    this.logger.log(`Deepgram pronto para consulta ${data.consultationId}`);
                    client.emit('stream-ready');
                },
                onTranscript: (text, isFinal) => {
                    this.logger.debug(`Transcript [${isFinal ? 'FINAL' : 'interim'}]: ${text}`);
                    client.emit('transcript', { text, isFinal });
                    if (isFinal) {
                        const session = this.sessions.get(client.id);
                        if (session) {
                            session.transcriptBuffer = session.transcriptBuffer
                                ? `${session.transcriptBuffer} ${text}`
                                : text;
                            session.finalSentenceCount += 1;
                            if (session.finalSentenceCount % 5 === 0) {
                                this.transcriptionService
                                    .appendTranscript(session.consultationId, session.transcriptBuffer)
                                    .catch((err) => this.logger.error('Erro ao salvar transcript:', err));
                            }
                        }
                    }
                },
                onError: (error) => {
                    this.logger.error(`Deepgram error para socket ${client.id}:`, error.message);
                    client.emit('error', { message: error.message });
                },
                onClose: () => {
                    this.logger.log(`Deepgram fechou para socket ${client.id}`);
                },
            });
            this.sessions.set(client.id, {
                deepgramConnection,
                consultationId: data.consultationId,
                veterinarianId,
                transcriptBuffer: '',
                finalSentenceCount: 0,
            });
            this.logger.log(`Aguardando Deepgram abrir para consulta ${data.consultationId}...`);
        }
        catch (error) {
            this.logger.error('Erro ao iniciar stream:', error);
            client.emit('error', { message: 'Erro ao iniciar transcrição em tempo real' });
        }
    }
    handleAudioChunk(client, data) {
        const session = this.sessions.get(client.id);
        if (!session) {
            this.logger.warn(`audio-chunk recebido sem sessão ativa para ${client.id}`);
            return;
        }
        const buffer = Buffer.from(data);
        this.logger.debug(`audio-chunk recebido: ${buffer.length} bytes para ${client.id}`);
        this.deepgramService.sendAudio(session.deepgramConnection, buffer);
    }
    async handleStopStream(client) {
        const session = this.sessions.get(client.id);
        if (!session)
            return;
        if (session.transcriptBuffer) {
            try {
                await this.transcriptionService.appendTranscript(session.consultationId, session.transcriptBuffer);
            }
            catch (err) {
                this.logger.error('Erro ao salvar transcript final:', err);
            }
        }
        this.cleanupSession(client.id);
        client.emit('stream-stopped');
    }
    cleanupSession(socketId) {
        const session = this.sessions.get(socketId);
        if (session) {
            this.deepgramService.closeConnection(session.deepgramConnection);
            this.sessions.delete(socketId);
            this.logger.log(`Sessão limpa para socket ${socketId}`);
        }
    }
};
exports.TranscriptionGateway = TranscriptionGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TranscriptionGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('start-stream'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], TranscriptionGateway.prototype, "handleStartStream", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('audio-chunk'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        ArrayBuffer]),
    __metadata("design:returntype", void 0)
], TranscriptionGateway.prototype, "handleAudioChunk", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('stop-stream'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], TranscriptionGateway.prototype, "handleStopStream", null);
exports.TranscriptionGateway = TranscriptionGateway = TranscriptionGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/transcription',
        cors: {
            origin: '*',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [deepgram_service_1.DeepgramService,
        transcription_service_1.TranscriptionService,
        jwt_1.JwtService,
        config_1.ConfigService])
], TranscriptionGateway);
//# sourceMappingURL=transcription.gateway.js.map