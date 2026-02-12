"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const owners_module_1 = require("./modules/owners/owners.module");
const patients_module_1 = require("./modules/patients/patients.module");
const protocols_module_1 = require("./modules/protocols/protocols.module");
const consultations_module_1 = require("./modules/consultations/consultations.module");
const soap_notes_module_1 = require("./modules/soap-notes/soap-notes.module");
const procedures_module_1 = require("./modules/procedures/procedures.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const settings_module_1 = require("./modules/settings/settings.module");
const transcription_module_1 = require("./modules/transcription/transcription.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            owners_module_1.OwnersModule,
            patients_module_1.PatientsModule,
            protocols_module_1.ProtocolsModule,
            consultations_module_1.ConsultationsModule,
            soap_notes_module_1.SoapNotesModule,
            procedures_module_1.ProceduresModule,
            analytics_module_1.AnalyticsModule,
            settings_module_1.SettingsModule,
            transcription_module_1.TranscriptionModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map