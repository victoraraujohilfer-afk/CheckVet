import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SoapNotesService } from './soap-notes.service';
import { CreateSoapNoteDto } from './dto/create-soap-note.dto';
import { UpdateSoapNoteDto } from './dto/update-soap-note.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('SOAP Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('consultations/:consultationId/soap')
export class SoapNotesController {
  constructor(private readonly soapNotesService: SoapNotesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar SOAP note para consulta' })
  async create(
    @Param('consultationId') consultationId: string,
    @Body() dto: CreateSoapNoteDto,
  ) {
    return this.soapNotesService.create(consultationId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obter SOAP note da consulta' })
  async findOne(@Param('consultationId') consultationId: string) {
    return this.soapNotesService.findByConsultation(consultationId);
  }

  @Patch()
  @ApiOperation({ summary: 'Atualizar SOAP note' })
  async update(
    @Param('consultationId') consultationId: string,
    @Body() dto: UpdateSoapNoteDto,
  ) {
    return this.soapNotesService.update(consultationId, dto);
  }
}
