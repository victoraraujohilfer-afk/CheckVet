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
exports.ProtocolsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProtocolsService = class ProtocolsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, veterinarianId) {
        const { items, ...protocolData } = dto;
        return this.prisma.protocol.create({
            data: {
                ...protocolData,
                veterinarianId,
                items: {
                    create: items.map((item, index) => ({
                        name: item.name,
                        order: item.order ?? index + 1,
                        isRequired: item.isRequired ?? true,
                    })),
                },
            },
            include: { items: { orderBy: { order: 'asc' } } },
        });
    }
    async findAll(veterinarianId, type) {
        const where = {
            isActive: true,
            veterinarianId,
        };
        if (type)
            where.type = type;
        return this.prisma.protocol.findMany({
            where,
            include: {
                items: { orderBy: { order: 'asc' } },
                _count: { select: { consultations: true } }
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, veterinarianId) {
        const protocol = await this.prisma.protocol.findUnique({
            where: { id },
            include: { items: { orderBy: { order: 'asc' } } },
        });
        if (!protocol) {
            throw new common_1.NotFoundException('Protocolo não encontrado');
        }
        if (protocol.veterinarianId !== veterinarianId) {
            throw new common_1.ForbiddenException('Você não tem permissão para acessar este protocolo');
        }
        return protocol;
    }
    async update(id, dto, veterinarianId) {
        await this.findOne(id, veterinarianId);
        const { items, ...protocolData } = dto;
        if (items) {
            await this.prisma.protocolItem.deleteMany({
                where: { protocolId: id },
            });
            return this.prisma.protocol.update({
                where: { id },
                data: {
                    ...protocolData,
                    items: {
                        create: items.map((item, index) => ({
                            name: item.name,
                            order: item.order ?? index + 1,
                            isRequired: item.isRequired ?? true,
                        })),
                    },
                },
                include: { items: { orderBy: { order: 'asc' } } },
            });
        }
        return this.prisma.protocol.update({
            where: { id },
            data: protocolData,
            include: { items: { orderBy: { order: 'asc' } } },
        });
    }
    async remove(id, veterinarianId) {
        await this.findOne(id, veterinarianId);
        return this.prisma.protocol.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async hardDelete(id, veterinarianId) {
        await this.findOne(id, veterinarianId);
        return this.prisma.protocol.delete({
            where: { id },
        });
    }
};
exports.ProtocolsService = ProtocolsService;
exports.ProtocolsService = ProtocolsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProtocolsService);
//# sourceMappingURL=protocols.service.js.map