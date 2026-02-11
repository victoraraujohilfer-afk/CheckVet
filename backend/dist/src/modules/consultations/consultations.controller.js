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
exports.ConsultationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const consultations_service_1 = require("./consultations.service");
const create_consultation_dto_1 = require("./dto/create-consultation.dto");
const update_consultation_dto_1 = require("./dto/update-consultation.dto");
const update_checklist_dto_1 = require("./dto/update-checklist.dto");
const query_consultation_dto_1 = require("./dto/query-consultation.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ConsultationsController = class ConsultationsController {
    constructor(consultationsService) {
        this.consultationsService = consultationsService;
    }
    async create(dto, userId) {
        return this.consultationsService.create(dto, userId);
    }
    async findAll(query) {
        return this.consultationsService.findAll(query);
    }
    async findOne(id) {
        return this.consultationsService.findOne(id);
    }
    async update(id, dto) {
        return this.consultationsService.update(id, dto);
    }
    async updateChecklistItem(id, itemId, dto) {
        return this.consultationsService.updateChecklistItem(id, itemId, dto);
    }
    async remove(id) {
        return this.consultationsService.remove(id);
    }
};
exports.ConsultationsController = ConsultationsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar nova consulta' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_consultation_dto_1.CreateConsultationDto, String]),
    __metadata("design:returntype", Promise)
], ConsultationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar consultas com filtros' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_consultation_dto_1.QueryConsultationDto]),
    __metadata("design:returntype", Promise)
], ConsultationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter detalhes completos da consulta' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar consulta' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_consultation_dto_1.UpdateConsultationDto]),
    __metadata("design:returntype", Promise)
], ConsultationsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/checklist/:itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar/desmarcar item do checklist' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_checklist_dto_1.UpdateChecklistDto]),
    __metadata("design:returntype", Promise)
], ConsultationsController.prototype, "updateChecklistItem", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover consulta' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultationsController.prototype, "remove", null);
exports.ConsultationsController = ConsultationsController = __decorate([
    (0, swagger_1.ApiTags)('Consultations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('consultations'),
    __metadata("design:paramtypes", [consultations_service_1.ConsultationsService])
], ConsultationsController);
//# sourceMappingURL=consultations.controller.js.map