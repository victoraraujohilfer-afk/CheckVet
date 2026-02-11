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
import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Owners')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo tutor' })
  async create(@Body() dto: CreateOwnerDto) {
    return this.ownersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tutores' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ownersService.findAll(search, Number(page) || 1, Number(limit) || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes do tutor com pets' })
  async findOne(@Param('id') id: string) {
    return this.ownersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar tutor' })
  async update(@Param('id') id: string, @Body() dto: UpdateOwnerDto) {
    return this.ownersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover tutor' })
  async remove(@Param('id') id: string) {
    return this.ownersService.remove(id);
  }
}
