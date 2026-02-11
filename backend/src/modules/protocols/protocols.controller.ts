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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ProtocolsService } from './protocols.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Protocols')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('protocols')
export class ProtocolsController {
  constructor(private readonly protocolsService: ProtocolsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar protocolos ativos' })
  @ApiQuery({ name: 'type', required: false })
  async findAll(@Query('type') type?: string) {
    return this.protocolsService.findAll(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter protocolo com itens do checklist' })
  async findOne(@Param('id') id: string) {
    return this.protocolsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Criar protocolo (admin)' })
  async create(@Body() dto: CreateProtocolDto) {
    return this.protocolsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar protocolo (admin)' })
  async update(@Param('id') id: string, @Body() dto: UpdateProtocolDto) {
    return this.protocolsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Desativar protocolo (admin)' })
  async remove(@Param('id') id: string) {
    return this.protocolsService.remove(id);
  }
}
