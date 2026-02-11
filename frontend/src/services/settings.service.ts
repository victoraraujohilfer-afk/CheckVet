import { api } from '@/lib/api';
import type { SystemSettings } from '@/types/api';

export const settingsService = {
  get: () =>
    api.get<{ data: SystemSettings }>('/settings').then((r) => r.data.data),

  update: (data: Partial<SystemSettings>) =>
    api.patch<{ data: SystemSettings }>('/settings', data).then((r) => r.data.data),
};
