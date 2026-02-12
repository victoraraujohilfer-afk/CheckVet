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
import { ProtocolsService } from './protocols.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Protocols')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('protocols')
export class ProtocolsController {
  constructor(private readonly protocolsService: ProtocolsService) { }

  // ✅ CRIAR PROTOCOLO (sempre do vet logado)
  @Post()
  @ApiOperation({ summary: 'Criar novo protocolo personalizado' })
  async create(
    @Body() dto: CreateProtocolDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.protocolsService.create(dto, userId);
  }

  // ✅ LISTAR PROTOCOLOS (apenas do vet logado)
  @Get()
  @ApiOperation({ summary: 'Listar meus protocolos' })
  @ApiQuery({ name: 'type', required: false })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('type') type?: string,
  ) {
    return this.protocolsService.findAll(userId, type);
  }

  // ✅ BUSCAR UM PROTOCOLO
  @Get(':id')
  @ApiOperation({ summary: 'Obter protocolo com itens' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.protocolsService.findOne(id, userId);
  }

  // ✅ ATUALIZAR PROTOCOLO
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar protocolo' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProtocolDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.protocolsService.update(id, dto, userId);
  }

  // ✅ SOFT DELETE (desativa)
  @Delete(':id')
  @ApiOperation({ summary: 'Desativar protocolo' })
  async remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.protocolsService.remove(id, userId);
  }

  // ✅ HARD DELETE (deleta permanentemente)
  @Delete(':id/permanent')
  @ApiOperation({ summary: 'Deletar protocolo permanentemente' })
  async hardDelete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.protocolsService.hardDelete(id, userId);
  }
}