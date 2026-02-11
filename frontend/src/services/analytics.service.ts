import { api } from '@/lib/api';
import type { DashboardAnalytics, VetRanking, ProtocolAdherence } from '@/types/api';

export const analyticsService = {
  getDashboard: () =>
    api.get<{ data: DashboardAnalytics }>('/analytics/dashboard').then((r) => r.data.data),

  getVeterinariansRanking: (limit?: number) =>
    api.get<{ data: VetRanking[] }>('/analytics/veterinarians', {
      params: limit ? { limit } : {},
    }).then((r) => r.data.data),

  getProtocolAdherence: () =>
    api.get<{ data: ProtocolAdherence[] }>('/analytics/protocols').then((r) => r.data.data),
};
