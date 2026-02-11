import { api } from '@/lib/api';
import type { Patient } from '@/types/api';

export const patientsService = {
  findAll: (params?: { ownerId?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/patients', { params }).then((r) => r.data.data),

  findOne: (id: string) =>
    api.get<{ data: Patient }>(`/patients/${id}`).then((r) => r.data.data),

  create: (data: {
    name: string;
    ownerId: string;
    species: string;
    breed?: string;
    gender: string;
    age?: string;
    weight?: number;
  }) => api.post<{ data: Patient }>('/patients', data).then((r) => r.data.data),

  update: (id: string, data: Partial<Patient>) =>
    api.patch<{ data: Patient }>(`/patients/${id}`, data).then((r) => r.data.data),
};
