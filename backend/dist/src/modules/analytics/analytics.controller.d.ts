import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboard(): Promise<{
        totalVeterinarians: number;
        activeVeterinarians: number;
        consultationsToday: number;
        totalConsultations: number;
        averageAdherence: number;
        pendingAlerts: number;
    }>;
    getVeterinariansRanking(limit?: number): Promise<{
        id: string;
        fullName: string;
        crmv: string | null;
        specialization: import(".prisma/client").$Enums.Specialization | null;
        status: import(".prisma/client").$Enums.UserStatus;
        totalConsultations: number;
        averageAdherence: number;
        lastConsultation: Date | null;
        lastLogin: Date | null;
    }[]>;
    getProtocolAdherence(): Promise<{
        id: string;
        name: string;
        type: import(".prisma/client").$Enums.ProtocolType;
        totalConsultations: number;
        averageAdherence: number;
    }[]>;
}
