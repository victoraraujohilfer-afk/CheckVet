import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProceduresService } from './procedures.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Procedures')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('consultations/:consultationId/procedures')
export class ProceduresController {
  constructor(private readonly proceduresService: ProceduresService) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar procedimento à consulta' })
  async create(
    @Param('consultationId') consultationId: string,
    @Body() dto: CreateProcedureDto,
  ) {
    return this.proceduresService.create(consultationId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar procedimentos da consulta' })
  async findAll(@Param('consultationId') consultationId: string) {
    return this.proceduresService.findByConsultation(consultationId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover procedimento' })
  async remove(@Param('id') id: string) {
    return this.proceduresService.remove(id);
  }
}
