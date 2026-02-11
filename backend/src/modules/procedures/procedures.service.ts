import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';

@Injectable()
export class ProceduresService {
  constructor(private prisma: PrismaService) {}

  async create(consultationId: string, dto: CreateProcedureDto) {
    return this.prisma.procedure.create({
      data: { consultationId, ...dto },
    });
  }

  async findByConsultation(consultationId: string) {
    return this.prisma.procedure.findMany({
      where: { consultationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async remove(id: string) {
    const procedure = await this.prisma.procedure.findUnique({ where: { id } });
    if (!procedure) throw new NotFoundException('Procedimento não encontrado');
    return this.prisma.procedure.delete({ where: { id } });
  }
}
