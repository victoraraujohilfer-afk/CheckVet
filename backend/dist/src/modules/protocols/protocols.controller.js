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
exports.ProtocolsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const protocols_service_1 = require("./protocols.service");
const create_protocol_dto_1 = require("./dto/create-protocol.dto");
const update_protocol_dto_1 = require("./dto/update-protocol.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ProtocolsController = class ProtocolsController {
    constructor(protocolsService) {
        this.protocolsService = protocolsService;
    }
    async create(dto, userId) {
        return this.protocolsService.create(dto, userId);
    }
    async findAll(userId, type) {
        return this.protocolsService.findAll(userId, type);
    }
    async findOne(id, userId) {
        return this.protocolsService.findOne(id, userId);
    }
    async update(id, dto, userId) {
        return this.protocolsService.update(id, dto, userId);
    }
    async remove(id, userId) {
        return this.protocolsService.remove(id, userId);
    }
    async hardDelete(id, userId) {
        return this.protocolsService.hardDelete(id, userId);
    }
};
exports.ProtocolsController = ProtocolsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo protocolo personalizado' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_protocol_dto_1.CreateProtocolDto, String]),
    __metadata("design:returntype", Promise)
], ProtocolsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar meus protocolos' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProtocolsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter protocolo com itens' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProtocolsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar protocolo' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_protocol_dto_1.UpdateProtocolDto, String]),
    __metadata("design:returntype", Promise)
], ProtocolsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Desativar protocolo' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProtocolsController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(':id/permanent'),
    (0, swagger_1.ApiOperation)({ summary: 'Deletar protocolo permanentemente' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProtocolsController.prototype, "hardDelete", null);
exports.ProtocolsController = ProtocolsController = __decorate([
    (0, swagger_1.ApiTags)('Protocols'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('protocols'),
    __metadata("design:paramtypes", [protocols_service_1.ProtocolsService])
], ProtocolsController);
//# sourceMappingURL=protocols.controller.js.map