import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePatientDto) {
    return this.prisma.patient.create({
      data: dto,
      include: { owner: true },
    });
  }

  async findAll(ownerId?: string, search?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (ownerId) where.ownerId = ownerId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { breed: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [patients, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        skip,
        take: limit,
        include: { owner: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.patient.count({ where }),
    ]);

    return { patients, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: { owner: true, consultations: { take: 5, orderBy: { date: 'desc' } } },
    });
    if (!patient) throw new NotFoundException('Paciente não encontrado');
    return patient;
  }

  async update(id: string, dto: UpdatePatientDto) {
    await this.findOne(id);
    return this.prisma.patient.update({
      where: { id },
      data: dto,
      include: { owner: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.patient.delete({ where: { id } });
  }
}
