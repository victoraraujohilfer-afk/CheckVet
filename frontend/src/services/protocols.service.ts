import { api } from '@/lib/api';
import type { Protocol } from '@/types/api';

export const protocolsService = {
  // Listar todos os protocolos do veterinário logado
  findAll: (type?: string) =>
    api.get<{ data: Protocol[] }>('/protocols', { params: { type } }).then((r) => r.data.data),

  // Buscar um protocolo específico
  findOne: (id: string) =>
    api.get<{ data: Protocol }>(`/protocols/${id}`).then((r) => r.data.data),

  // Criar novo protocolo
  create: (data: {
    name: string;
    description?: string;
    type: string;
    items: { name: string; order: number; isRequired?: boolean }[];
  }) => api.post<{ data: Protocol }>('/protocols', data).then((r) => r.data.data),

  // Atualizar protocolo
  update: (
    id: string,
    data: {
      name?: string;
      description?: string;
      type?: string;
      items?: { name: string; order: number; isRequired?: boolean }[];
    }
  ) => api.patch<{ data: Protocol }>(`/protocols/${id}`, data).then((r) => r.data.data),

  // Deletar protocolo (soft delete)
  remove: (id: string) => api.delete(`/protocols/${id}`).then((r) => r.data.data),

  // Deletar permanentemente
  hardDelete: (id: string) => api.delete(`/protocols/${id}/permanent`).then((r) => r.data.data),
};