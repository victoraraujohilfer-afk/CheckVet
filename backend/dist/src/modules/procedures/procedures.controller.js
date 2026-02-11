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
exports.ProceduresController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const procedures_service_1 = require("./procedures.service");
const create_procedure_dto_1 = require("./dto/create-procedure.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let ProceduresController = class ProceduresController {
    constructor(proceduresService) {
        this.proceduresService = proceduresService;
    }
    async create(consultationId, dto) {
        return this.proceduresService.create(consultationId, dto);
    }
    async findAll(consultationId) {
        return this.proceduresService.findByConsultation(consultationId);
    }
    async remove(id) {
        return this.proceduresService.remove(id);
    }
};
exports.ProceduresController = ProceduresController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Adicionar procedimento à consulta' }),
    __param(0, (0, common_1.Param)('consultationId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_procedure_dto_1.CreateProcedureDto]),
    __metadata("design:returntype", Promise)
], ProceduresController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar procedimentos da consulta' }),
    __param(0, (0, common_1.Param)('consultationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProceduresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover procedimento' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProceduresController.prototype, "remove", null);
exports.ProceduresController = ProceduresController = __decorate([
    (0, swagger_1.ApiTags)('Procedures'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('consultations/:consultationId/procedures'),
    __metadata("design:paramtypes", [procedures_service_1.ProceduresService])
], ProceduresController);
//# sourceMappingURL=procedures.controller.js.map