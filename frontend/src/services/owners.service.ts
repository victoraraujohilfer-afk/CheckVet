import { api } from '@/lib/api';
import type { Owner } from '@/types/api';

export const ownersService = {
  findAll: (params?: { search?: string; page?: number; limit?: number }) =>
    api.get('/owners', { params }).then((r) => r.data.data),

  findOne: (id: string) =>
    api.get<{ data: Owner }>(`/owners/${id}`).then((r) => r.data.data),

  create: (data: { fullName: string; email?: string; phone: string; address?: string }) =>
    api.post<{ data: Owner }>('/owners', data).then((r) => r.data.data),

  update: (id: string, data: Partial<Owner>) =>
    api.patch<{ data: Owner }>(`/owners/${id}`, data).then((r) => r.data.data),
};
