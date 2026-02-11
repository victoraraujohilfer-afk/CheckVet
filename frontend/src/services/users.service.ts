import { api } from '@/lib/api';
import type { User } from '@/types/api';

interface UsersQuery {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

export const usersService = {
  findAll: (params?: UsersQuery) =>
    api.get<{ data: UsersResponse }>('/users', { params }).then((r) => r.data.data),

  findOne: (id: string) =>
    api.get<{ data: User }>(`/users/${id}`).then((r) => r.data.data),

  create: (data: {
    fullName: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
    crmv?: string;
    specialization?: string;
    clinicName?: string;
  }) => api.post<{ data: User }>('/users', data).then((r) => r.data.data),

  update: (id: string, data: Partial<User>) =>
    api.patch<{ data: User }>(`/users/${id}`, data).then((r) => r.data.data),

  remove: (id: string) =>
    api.delete(`/users/${id}`).then((r) => r.data.data),
};
