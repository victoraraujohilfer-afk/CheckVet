import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { QueryConsultationDto } from './dto/query-consultation.dto';
import { Prisma } from '@prisma/client';
import { PDFService } from './pdf.service';

@Injectable()
export class ConsultationsService {
  constructor(
    private prisma: PrismaService,
    private pdfService: PDFService,
  ) {}

  async create(dto: CreateConsultationDto, veterinarianId: string) {
    const consultation = await this.prisma.consultation.create({
      data: {
        patientId: dto.patientId,
        ownerId: dto.ownerId,
        veterinarianId,
        protocolId: dto.protocolId,
        type: dto.type,
        chiefComplaint: dto.chiefComplaint,
        date: new Date(dto.date),
        status: 'IN_PROGRESS',
      },
      include: {
        patient: true,
        owner: true,
        veterinarian: { select: { id: true, fullName: true, crmv: true } },
        protocol: { include: { items: { orderBy: { order: 'asc' } } } },
      },
    });

    // Auto-create checklist items from protocol
    if (dto.protocolId) {
      const protocol = await this.prisma.protocol.findUnique({
        where: { id: dto.protocolId },
        include: { items: true },
      });

      if (protocol) {
        await this.prisma.consultationChecklist.createMany({
          data: protocol.items.map((item) => ({
            consultationId: consultation.id,
            protocolItemId: item.id,
            completed: false,
          })),
        });
      }
    }

    return consultation;
  }

  async findAll(query: QueryConsultationDto) {
    const { veterinarianId, patientId, status, type, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ConsultationWhereInput = {};

    if (veterinarianId) where.veterinarianId = veterinarianId;
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { patient: { name: { contains: search, mode: 'insensitive' } } },
        { owner: { fullName: { contains: search, mode: 'insensitive' } } },
        { chiefComplaint: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [consultations, total] = await Promise.all([
      this.prisma.consultation.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: true,
          owner: true,
          veterinarian: { select: { id: true, fullName: true, crmv: true } },
          protocol: { select: { id: true, name: true, type: true } },
        },
        orderBy: { date: 'desc' },
      }),
      this.prisma.consultation.count({ where }),
    ]);

    return { consultations, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id },
      include: {
        patient: { include: { owner: true } },
        owner: true,
        veterinarian: {
          select: {
            id: true,
            fullName: true,
            crmv: true,
            specialization: true,
            clinicName: true,
            clinicLogoUrl: true,
          },
        },
        protocol: { include: { items: { orderBy: { order: 'asc' } } } },
        checklist: {
          include: { protocolItem: true },
          orderBy: { protocolItem: { order: 'asc' } },
        },
        soapNote: true,
        procedures: true,
        attachments: true,
      },
    });

    if (!consultation) throw new NotFoundException('Consulta não encontrada');
    return consultation;
  }

  async update(id: string, dto: UpdateConsultationDto) {
    await this.findOne(id);
    return this.prisma.consultation.update({
      where: { id },
      data: dto,
      include: { patient: true, owner: true },
    });
  }

  async updateChecklistItem(consultationId: string, itemId: string, dto: UpdateChecklistDto) {
    const checklist = await this.prisma.consultationChecklist.findFirst({
      where: { consultationId, protocolItemId: itemId },
    });

    if (!checklist) throw new NotFoundException('Item do checklist não encontrado');

    const updated = await this.prisma.consultationChecklist.update({
      where: { id: checklist.id },
      data: {
        completed: dto.completed,
        completedAt: dto.completed ? new Date() : null,
        notes: dto.notes,
      },
    });

    // Recalculate adherence
    await this.recalculateAdherence(consultationId);

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.consultation.delete({ where: { id } });
  }

  async generatePDF(id: string): Promise<Buffer> {
    const consultation = await this.findOne(id);

    // Formatar dados para o PDF
    const pdfData = {
      id: consultation.id,
      patient: {
        name: consultation.patient.name,
        species: consultation.patient.species,
        breed: consultation.patient.breed,
        gender: consultation.patient.gender,
        age: consultation.patient.age,
        weight: consultation.patient.weight
          ? parseFloat(consultation.patient.weight.toString())
          : null,
      },
      owner: {
        fullName: consultation.owner.fullName,
        phone: consultation.owner.phone,
        email: consultation.owner.email,
        address: consultation.owner.address,
      },
      veterinarian: {
        fullName: consultation.veterinarian.fullName,
        crmv: consultation.veterinarian.crmv,
        specialization: consultation.veterinarian.specialization,
        clinicName: consultation.veterinarian.clinicName || 'CheckVet Hospital',
        clinicLogoUrl: consultation.veterinarian.clinicLogoUrl,
      },
      type: consultation.type,
      status: consultation.status,
      date: consultation.date,
      chiefComplaint: consultation.chiefComplaint,
      adherencePercentage: consultation.adherencePercentage,
      protocol: consultation.protocol
        ? {
            name: consultation.protocol.name,
            description: consultation.protocol.description,
          }
        : null,
      checklist: consultation.checklist
        ? consultation.checklist.map((item) => ({
            id: item.id,
            name: item.protocolItem.name,
            completed: item.completed,
            completedAt: item.completedAt,
            notes: item.notes,
          }))
        : [],
      soapNote: consultation.soapNote
        ? {
            subjective: consultation.soapNote.subjective,
            objectiveData: consultation.soapNote.objectiveData,
            assessment: consultation.soapNote.assessment,
            plan: consultation.soapNote.plan,
          }
        : null,
      procedures: consultation.procedures
        ? consultation.procedures.map((proc) => ({
            name: proc.name,
            code: proc.code,
            value: proc.value ? parseFloat(proc.value.toString()) : null,
          }))
        : [],
    };

    return await this.pdfService.generateConsultationPDF(pdfData);
  }

  private async recalculateAdherence(consultationId: string) {
    const items = await this.prisma.consultationChecklist.findMany({
      where: { consultationId },
    });

    if (items.length === 0) return;

    const completed = items.filter((i) => i.completed).length;
    const percentage = Math.round((completed / items.length) * 100);

    await this.prisma.consultation.update({
      where: { id: consultationId },
      data: { adherencePercentage: percentage },
    });
  }
}
