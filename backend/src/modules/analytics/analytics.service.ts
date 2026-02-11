import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalVets,
      activeVets,
      consultationsToday,
      totalConsultations,
      avgAdherence,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'VETERINARIAN' } }),
      this.prisma.user.count({ where: { role: 'VETERINARIAN', status: 'ACTIVE' } }),
      this.prisma.consultation.count({
        where: { date: { gte: today, lt: tomorrow } },
      }),
      this.prisma.consultation.count(),
      this.prisma.consultation.aggregate({
        _avg: { adherencePercentage: true },
        where: { adherencePercentage: { not: null } },
      }),
    ]);

    const pendingAlerts = await this.prisma.consultation.count({
      where: {
        status: 'COMPLETED',
        adherencePercentage: { lt: 80 },
      },
    });

    return {
      totalVeterinarians: totalVets,
      activeVeterinarians: activeVets,
      consultationsToday,
      totalConsultations,
      averageAdherence: Math.round(avgAdherence._avg.adherencePercentage || 0),
      pendingAlerts,
    };
  }

  async getVeterinariansRanking(limit = 10) {
    const vets = await this.prisma.user.findMany({
      where: { role: 'VETERINARIAN', status: 'ACTIVE' },
      select: {
        id: true,
        fullName: true,
        crmv: true,
        specialization: true,
        status: true,
        lastLogin: true,
        consultations: {
          select: { adherencePercentage: true, date: true },
          orderBy: { date: 'desc' },
        },
        _count: { select: { consultations: true } },
      },
      take: limit,
    });

    return vets.map((vet) => {
      const totalConsultations = vet._count.consultations;
      const avgAdherence =
        totalConsultations > 0
          ? Math.round(
              vet.consultations.reduce(
                (sum, c) => sum + (c.adherencePercentage || 0),
                0,
              ) / totalConsultations,
            )
          : 0;
      const lastConsultation =
        vet.consultations.length > 0 ? vet.consultations[0].date : null;

      return {
        id: vet.id,
        fullName: vet.fullName,
        crmv: vet.crmv,
        specialization: vet.specialization,
        status: vet.status,
        totalConsultations,
        averageAdherence: avgAdherence,
        lastConsultation,
        lastLogin: vet.lastLogin,
      };
    });
  }

  async getProtocolAdherence() {
    const protocols = await this.prisma.protocol.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        type: true,
        consultations: {
          select: { adherencePercentage: true },
        },
        _count: { select: { consultations: true } },
      },
    });

    return protocols.map((protocol) => {
      const total = protocol._count.consultations;
      const avgAdherence =
        total > 0
          ? Math.round(
              protocol.consultations.reduce(
                (sum, c) => sum + (c.adherencePercentage || 0),
                0,
              ) / total,
            )
          : 0;

      return {
        id: protocol.id,
        name: protocol.name,
        type: protocol.type,
        totalConsultations: total,
        averageAdherence: avgAdherence,
      };
    });
  }
}
