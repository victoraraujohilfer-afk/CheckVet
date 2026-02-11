import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPERVISOR)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'KPIs gerais do dashboard admin' })
  async getDashboard() {
    return this.analyticsService.getDashboard();
  }

  @Get('veterinarians')
  @ApiOperation({ summary: 'Ranking de veterinários por aderência' })
  @ApiQuery({ name: 'limit', required: false })
  async getVeterinariansRanking(@Query('limit') limit?: number) {
    return this.analyticsService.getVeterinariansRanking(Number(limit) || 10);
  }

  @Get('protocols')
  @ApiOperation({ summary: 'Aderência por protocolo' })
  async getProtocolAdherence() {
    return this.analyticsService.getProtocolAdherence();
  }
}
