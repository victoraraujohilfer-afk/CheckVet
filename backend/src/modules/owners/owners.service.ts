import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';

@Injectable()
export class OwnersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOwnerDto) {
    return this.prisma.owner.create({ data: dto });
  }

  async findAll(search?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search } },
          ],
        }
      : {};

    const [owners, total] = await Promise.all([
      this.prisma.owner.findMany({
        where,
        skip,
        take: limit,
        include: { patients: true, _count: { select: { consultations: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.owner.count({ where }),
    ]);

    return { owners, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const owner = await this.prisma.owner.findUnique({
      where: { id },
      include: { patients: true },
    });
    if (!owner) throw new NotFoundException('Tutor não encontrado');
    return owner;
  }

  async update(id: string, dto: UpdateOwnerDto) {
    await this.findOne(id);
    return this.prisma.owner.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.owner.delete({ where: { id } });
  }
}
