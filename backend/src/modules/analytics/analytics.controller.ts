import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'KPIs gerais do dashboard admin' })
  async getDashboard(@CurrentUser('id') userId: string) {
    return this.analyticsService.getDashboard(userId);
  }

  @Get('veterinarians')
  @ApiOperation({ summary: 'Ranking de veterinários por aderência' })
  @ApiQuery({ name: 'limit', required: false })
  async getVeterinariansRanking(
    @Query('limit') limit?: number,
    @CurrentUser('id') userId?: string,
  ) {
    return this.analyticsService.getVeterinariansRanking(
      Number(limit) || 10,
      userId,
    );
  }

  @Get('protocols')
  @ApiOperation({ summary: 'Aderência por protocolo' })
  async getProtocolAdherence(@CurrentUser('id') userId: string) {
    return this.analyticsService.getProtocolAdherence(userId);
  }
}
