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
exports.CreateConsultationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateConsultationDto {
}
exports.CreateConsultationDto = CreateConsultationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ConsultationType, example: client_1.ConsultationType.ROUTINE }),
    (0, class_validator_1.IsEnum)(client_1.ConsultationType),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.protocolId !== ''),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "protocolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Animal apresentando apatia e falta de apetite' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "chiefComplaint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-15T14:30:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "date", void 0);
//# sourceMappingURL=create-consultation.dto.js.map