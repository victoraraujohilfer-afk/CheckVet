import { api } from '@/lib/api';
import type { Protocol } from '@/types/api';

export const protocolsService = {
  findAll: (type?: string) =>
    api.get<{ data: Protocol[] }>('/protocols', { params: type ? { type } : {} }).then((r) => r.data.data),

  findOne: (id: string) =>
    api.get<{ data: Protocol }>(`/protocols/${id}`).then((r) => r.data.data),
};
