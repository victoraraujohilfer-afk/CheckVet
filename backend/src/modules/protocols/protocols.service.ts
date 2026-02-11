import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';

@Injectable()
export class ProtocolsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProtocolDto) {
    const { items, ...protocolData } = dto;

    return this.prisma.protocol.create({
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

  async findAll(type?: string) {
    const where: any = { isActive: true };
    if (type) where.type = type;

    return this.prisma.protocol.findMany({
      where,
      include: { items: { orderBy: { order: 'asc' } }, _count: { select: { consultations: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const protocol = await this.prisma.protocol.findUnique({
      where: { id },
      include: { items: { orderBy: { order: 'asc' } } },
    });
    if (!protocol) throw new NotFoundException('Protocolo não encontrado');
    return protocol;
  }

  async update(id: string, dto: UpdateProtocolDto) {
    await this.findOne(id);
    return this.prisma.protocol.update({
      where: { id },
      data: dto,
      include: { items: { orderBy: { order: 'asc' } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.protocol.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
