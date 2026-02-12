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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptionController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const transcription_service_1 = require("./transcription.service");
const transcription_dto_1 = require("./dto/transcription.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const multer_1 = require("multer");
const path_1 = require("path");
let TranscriptionController = class TranscriptionController {
    constructor(transcriptionService) {
        this.transcriptionService = transcriptionService;
    }
    async startTranscription(dto, userId) {
        return this.transcriptionService.startTranscription(dto.consultationId, userId);
    }
    async recordConsent(dto) {
        return this.transcriptionService.recordConsent(dto);
    }
    async uploadAudio(file, consultationId) {
        return this.transcriptionService.transcribeAudioChunk(file, consultationId);
    }
    async analyzeTranscript(dto) {
        return this.transcriptionService.analyzeAndAutoCheck(dto);
    }
    async finishTranscription(consultationId, duration) {
        return this.transcriptionService.finishTranscription(consultationId, duration);
    }
    async getTranscription(consultationId) {
        return this.transcriptionService.getTranscription(consultationId);
    }
};
exports.TranscriptionController = TranscriptionController;
__decorate([
    (0, common_1.Post)('start'),
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar sessão de transcrição' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transcription_dto_1.StartTranscriptionDto, String]),
    __metadata("design:returntype", Promise)
], TranscriptionController.prototype, "startTranscription", null);
__decorate([
    (0, common_1.Post)('consent'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar consentimento LGPD' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transcription_dto_1.ConsentDto]),
    __metadata("design:returntype", Promise)
], TranscriptionController.prototype, "recordConsent", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload de chunk de áudio para transcrição' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('audio', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/audio',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                callback(null, `audio-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: {
            fileSize: 25 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('consultationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TranscriptionController.prototype, "uploadAudio", null);
__decorate([
    (0, common_1.Post)('analyze'),
    (0, swagger_1.ApiOperation)({ summary: 'Analisar transcrição e auto-marcar checklist' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transcription_dto_1.AnalyzeTranscriptDto]),
    __metadata("design:returntype", Promise)
], TranscriptionController.prototype, "analyzeTranscript", null);
__decorate([
    (0, common_1.Post)('finish/:consultationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Finalizar transcrição' }),
    __param(0, (0, common_1.Param)('consultationId')),
    __param(1, (0, common_1.Body)('duration')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], TranscriptionController.prototype, "finishTranscription", null);
__decorate([
    (0, common_1.Get)(':consultationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter transcrição de uma consulta' }),
    __param(0, (0, common_1.Param)('consultationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TranscriptionController.prototype, "getTranscription", null);
exports.TranscriptionController = TranscriptionController = __decorate([
    (0, swagger_1.ApiTags)('Transcription'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('transcription'),
    __metadata("design:paramtypes", [transcription_service_1.TranscriptionService])
], TranscriptionController);
//# sourceMappingURL=transcription.controller.js.map