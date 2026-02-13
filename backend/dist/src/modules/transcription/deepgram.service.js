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
var DeepgramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepgramService = void 0;
const common_1 = require("@nestjs/common");
const sdk_1 = require("@deepgram/sdk");
let DeepgramService = DeepgramService_1 = class DeepgramService {
    constructor() {
        this.logger = new common_1.Logger(DeepgramService_1.name);
        this.client = (0, sdk_1.createClient)(process.env.DEEPGRAM_API_KEY);
    }
    createLiveConnection(callbacks) {
        const connection = this.client.listen.live({
            model: 'nova-3',
            language: 'pt-BR',
            smart_format: true,
            punctuate: true,
            interim_results: true,
            endpointing: 300,
        });
        connection.on(sdk_1.LiveTranscriptionEvents.Open, () => {
            this.logger.log('Deepgram: conexão aberta — pronto para receber áudio');
            callbacks.onOpen();
        });
        connection.on(sdk_1.LiveTranscriptionEvents.Transcript, (data) => {
            const transcript = data.channel?.alternatives?.[0]?.transcript;
            if (transcript && transcript.trim().length > 0) {
                const isFinal = data.is_final === true;
                callbacks.onTranscript(transcript, isFinal);
            }
        });
        connection.on(sdk_1.LiveTranscriptionEvents.Error, (error) => {
            this.logger.error('Deepgram error:', error);
            callbacks.onError(new Error(error?.message || 'Erro no Deepgram'));
        });
        connection.on(sdk_1.LiveTranscriptionEvents.Close, () => {
            this.logger.log('Deepgram: conexão fechada');
            callbacks.onClose();
        });
        return connection;
    }
    sendAudio(connection, audioData) {
        try {
            const arrayBuffer = audioData.buffer.slice(audioData.byteOffset, audioData.byteOffset + audioData.byteLength);
            connection.send(arrayBuffer);
        }
        catch (error) {
            this.logger.error('Erro ao enviar áudio ao Deepgram:', error);
        }
    }
    closeConnection(connection) {
        try {
            connection.requestClose();
        }
        catch (error) {
            this.logger.error('Erro ao fechar conexão Deepgram:', error);
        }
    }
};
exports.DeepgramService = DeepgramService;
exports.DeepgramService = DeepgramService = DeepgramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DeepgramService);
//# sourceMappingURL=deepgram.service.js.map