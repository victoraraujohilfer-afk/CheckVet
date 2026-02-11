import { api } from '@/lib/api';
import type { Consultation } from '@/types/api';

interface ConsultationsQuery {
  veterinarianId?: string;
  patientId?: string;
  status?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface ConsultationsResponse {
  consultations: Consultation[];
  total: number;
  page: number;
  totalPages: number;
}

export const consultationsService = {
  findAll: (params?: ConsultationsQuery) =>
    api.get<{ data: ConsultationsResponse }>('/consultations', { params }).then((r) => r.data.data),

  findOne: (id: string) =>
    api.get<{ data: Consultation }>(`/consultations/${id}`).then((r) => r.data.data),

  create: (data: {
    patientId: string;
    ownerId: string;
    type: string;
    protocolId?: string;
    chiefComplaint?: string;
    date: string;
  }) => api.post<{ data: Consultation }>('/consultations', data).then((r) => r.data.data),

  update: (id: string, data: { chiefComplaint?: string; status?: string }) =>
    api.patch<{ data: Consultation }>(`/consultations/${id}`, data).then((r) => r.data.data),

  updateChecklistItem: (consultationId: string, itemId: string, data: { completed: boolean; notes?: string }) =>
    api.patch(`/consultations/${consultationId}/checklist/${itemId}`, data).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/consultations/${id}`).then((r) => r.data.data),
};