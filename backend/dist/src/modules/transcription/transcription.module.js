"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscriptionModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const transcription_controller_1 = require("./transcription.controller");
const transcription_service_1 = require("./transcription.service");
const deepgram_service_1 = require("./deepgram.service");
const ai_analysis_service_1 = require("./ai-analysis.service");
const transcription_gateway_1 = require("./transcription.gateway");
const transcription_cleanup_cron_1 = require("./transcription-cleanup.cron");
const prisma_module_1 = require("../../prisma/prisma.module");
let TranscriptionModule = class TranscriptionModule {
};
exports.TranscriptionModule = TranscriptionModule;
exports.TranscriptionModule = TranscriptionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [transcription_controller_1.TranscriptionController],
        providers: [
            transcription_service_1.TranscriptionService,
            deepgram_service_1.DeepgramService,
            ai_analysis_service_1.AIAnalysisService,
            transcription_gateway_1.TranscriptionGateway,
            transcription_cleanup_cron_1.TranscriptionCleanupCron,
        ],
        exports: [transcription_service_1.TranscriptionService],
    })
], TranscriptionModule);
//# sourceMappingURL=transcription.module.js.map