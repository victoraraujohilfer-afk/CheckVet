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
const swagger_1 = require("@nestjs/swagger");
const transcription_service_1 = require("./transcription.service");
const transcription_dto_1 = require("./dto/transcription.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let TranscriptionController = class TranscriptionController {
    constructor(transcriptionService) {
        this.transcriptionService = transcriptionService;
    }
    async startTranscription(dto, userId) {
        return this.transcriptionService.startTranscription(dto.consultationId, userId);
    }
    async recordConsent(dto, userId) {
        return this.transcriptionService.recordConsent(dto, userId);
    }
    async analyzeTranscript(dto, userId) {
        return this.transcriptionService.analyzeAndAutoCheck(dto, userId);
    }
    async finishTranscription(consultationId, duration, userId) {
        return this.transcriptionService.finishTranscription(consultationId, duration, userId);
    }
    async getTranscription(consultationId, userId) {
        return this.transcriptionService.getTranscription(consultationId, userId);
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
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transcription_dto_1.ConsentDto, String]),
    __metadata("design:returntype", Promise)
], TranscriptionController.prototype, "recordConsent", null);
__decorate([
    (0, common_1.Post)('analyze'),
    (0, swagger_1.ApiOperation)({ summary: 'Analisar transcrição e auto-marcar checklist' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transcription_dto_1.AnalyzeTranscriptDto, String]),
    __metadata("design:returntype", Promise)
], TranscriptionController.prototype, "analyzeTranscript", null);
__decorate([
    (0, common_1.Post)('finish/:consultationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Finalizar transcrição' }),
    __param(0, (0, common_1.Param)('consultationId')),
    __param(1, (0, common_1.Body)('duration')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], TranscriptionController.prototype, "finishTranscription", null);
__decorate([
    (0, common_1.Get)(':consultationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter transcrição de uma consulta' }),
    __param(0, (0, common_1.Param)('consultationId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
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