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
exports.CreateSoapNoteDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateSoapNoteDto {
}
exports.CreateSoapNoteDto = CreateSoapNoteDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Animal apresentando apatia há 2 dias, sem apetite' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoapNoteDto.prototype, "subjective", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: {
            temperature: '38.5°C',
            heartRate: '90 bpm',
            respiratoryRate: '24 mpm',
            mucosas: 'Normocoradas',
            hydration: 'Normal (TPC < 2s)',
            bodyCondition: '5/9',
            generalExam: 'Sem alterações significativas',
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateSoapNoteDto.prototype, "objectiveData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Suspeita de gastrite' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoapNoteDto.prototype, "assessment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Medicação prescrita, retorno em 7 dias' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSoapNoteDto.prototype, "plan", void 0);
//# sourceMappingURL=create-soap-note.dto.js.map