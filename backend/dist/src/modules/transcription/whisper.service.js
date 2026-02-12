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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhisperService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
const fs = require("fs");
let WhisperService = class WhisperService {
    constructor() {
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    async transcribeAudio(audioFile) {
        try {
            const allowedFormats = ['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm'];
            const fileExt = audioFile.originalname.split('.').pop()?.toLowerCase();
            if (!fileExt || !allowedFormats.includes(fileExt)) {
                throw new common_1.BadRequestException(`Formato de áudio não suportado. Use: ${allowedFormats.join(', ')}`);
            }
            if (audioFile.size > 25 * 1024 * 1024) {
                throw new common_1.BadRequestException('Arquivo muito grande. Máximo: 25MB');
            }
            const fileStream = fs.createReadStream(audioFile.path);
            const transcription = await this.openai.audio.transcriptions.create({
                file: fileStream,
                model: 'whisper-1',
                language: 'pt',
                response_format: 'text',
                temperature: 0.2,
            });
            fs.unlinkSync(audioFile.path);
            return transcription;
        }
        catch (error) {
            if (audioFile?.path && fs.existsSync(audioFile.path)) {
                fs.unlinkSync(audioFile.path);
            }
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Erro ao transcrever áudio: ${error.message}`);
        }
    }
    async transcribeWithTimestamps(audioFile) {
        try {
            const fileStream = fs.createReadStream(audioFile.path);
            const transcription = await this.openai.audio.transcriptions.create({
                file: fileStream,
                model: 'whisper-1',
                language: 'pt',
                response_format: 'verbose_json',
                timestamp_granularities: ['segment'],
            });
            fs.unlinkSync(audioFile.path);
            return transcription;
        }
        catch (error) {
            if (audioFile?.path && fs.existsSync(audioFile.path)) {
                fs.unlinkSync(audioFile.path);
            }
            throw new common_1.BadRequestException(`Erro ao transcrever: ${error.message}`);
        }
    }
};
exports.WhisperService = WhisperService;
exports.WhisperService = WhisperService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], WhisperService);
//# sourceMappingURL=whisper.service.js.map