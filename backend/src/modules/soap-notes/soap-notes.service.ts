import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSoapNoteDto } from './dto/create-soap-note.dto';
import { UpdateSoapNoteDto } from './dto/update-soap-note.dto';

@Injectable()
export class SoapNotesService {
  constructor(private prisma: PrismaService) {}

  async create(consultationId: string, dto: CreateSoapNoteDto) {
    const existing = await this.prisma.soapNote.findUnique({
      where: { consultationId },
    });
    if (existing) {
      throw new ConflictException('SOAP note já existe para esta consulta');
    }

    return this.prisma.soapNote.create({
      data: { consultationId, ...dto },
    });
  }

  async findByConsultation(consultationId: string) {
    const note = await this.prisma.soapNote.findUnique({
      where: { consultationId },
    });
    if (!note) throw new NotFoundException('SOAP note não encontrada');
    return note;
  }

  async update(consultationId: string, dto: UpdateSoapNoteDto) {
    const existing = await this.prisma.soapNote.findUnique({
      where: { consultationId },
    });
    if (!existing) throw new NotFoundException('SOAP note não encontrada');

    return this.prisma.soapNote.update({
      where: { consultationId },
      data: dto,
    });
  }
}
