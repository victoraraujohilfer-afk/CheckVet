import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';

@Injectable()
export class ProtocolsService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateProtocolDto, veterinarianId: string) {
    const { items, ...protocolData } = dto;

    return this.prisma.protocol.create({
      data: {
        ...protocolData,
        veterinarianId,  // ✅ Associa ao vet logado
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

  // ✅ LISTAR PROTOCOLOS (apenas do veterinário logado)
  async findAll(veterinarianId: string, type?: string) {
    const where: any = {
      isActive: true,
      veterinarianId,  // ✅ Filtra apenas protocolos do vet
    };

    if (type) where.type = type;

    return this.prisma.protocol.findMany({
      where,
      include: {
        items: { orderBy: { order: 'asc' } },
        _count: { select: { consultations: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ BUSCAR UM PROTOCOLO (verificar se pertence ao vet)
  async findOne(id: string, veterinarianId: string) {
    const protocol = await this.prisma.protocol.findUnique({
      where: { id },
      include: { items: { orderBy: { order: 'asc' } } },
    });

    if (!protocol) {
      throw new NotFoundException('Protocolo não encontrado');
    }

    // ✅ Verifica se o protocolo pertence ao vet
    if (protocol.veterinarianId !== veterinarianId) {
      throw new ForbiddenException('Você não tem permissão para acessar este protocolo');
    }

    return protocol;
  }

  // ✅ ATUALIZAR PROTOCOLO (apenas se pertencer ao vet)
  async update(id: string, dto: UpdateProtocolDto, veterinarianId: string) {
    await this.findOne(id, veterinarianId);  // Valida ownership

    const { items, ...protocolData } = dto;

    // Se está atualizando items, deleta os antigos e cria novos
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

  // ✅ DELETAR PROTOCOLO (soft delete - apenas se pertencer ao vet)
  async remove(id: string, veterinarianId: string) {
    await this.findOne(id, veterinarianId);  // Valida ownership

    return this.prisma.protocol.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ✅ DELETAR PERMANENTEMENTE (hard delete)
  async hardDelete(id: string, veterinarianId: string) {
    await this.findOne(id, veterinarianId);

    return this.prisma.protocol.delete({
      where: { id },
    });
  }
}