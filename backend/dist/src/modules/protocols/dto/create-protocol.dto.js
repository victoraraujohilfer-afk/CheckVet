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
exports.CreateProtocolDto = exports.ProtocolItemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class ProtocolItemDto {
}
exports.ProtocolItemDto = ProtocolItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Anamnese completa' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProtocolItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ProtocolItemDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProtocolItemDto.prototype, "isRequired", void 0);
class CreateProtocolDto {
}
exports.CreateProtocolDto = CreateProtocolDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Exame Clínico Geral' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Protocolo padrão para exame clínico geral' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ProtocolType, example: client_1.ProtocolType.GENERAL_EXAM }),
    (0, class_validator_1.IsEnum)(client_1.ProtocolType),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProtocolItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ProtocolItemDto),
    __metadata("design:type", Array)
], CreateProtocolDto.prototype, "items", void 0);
//# sourceMappingURL=create-protocol.dto.js.map