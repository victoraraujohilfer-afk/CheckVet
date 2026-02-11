import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { QueryConsultationDto } from './dto/query-consultation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Consultations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova consulta' })
  async create(
    @Body() dto: CreateConsultationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.consultationsService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar consultas com filtros' })
  async findAll(@Query() query: QueryConsultationDto) {
    return this.consultationsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes completos da consulta' })
  async findOne(@Param('id') id: string) {
    return this.consultationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar consulta' })
  async update(@Param('id') id: string, @Body() dto: UpdateConsultationDto) {
    return this.consultationsService.update(id, dto);
  }

  @Patch(':id/checklist/:itemId')
  @ApiOperation({ summary: 'Marcar/desmarcar item do checklist' })
  async updateChecklistItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateChecklistDto,
  ) {
    return this.consultationsService.updateChecklistItem(id, itemId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover consulta' })
  async remove(@Param('id') id: string) {
    return this.consultationsService.remove(id);
  }
}
