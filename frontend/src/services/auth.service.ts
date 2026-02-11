import { api } from '@/lib/api';
import type { AuthResponse } from '@/types/api';

export const authService = {
  login: (email: string, password: string) =>
    api.post<{ data: AuthResponse }>('/auth/login', { email, password }).then((r) => r.data.data),

  logout: () => api.post('/auth/logout'),

  getMe: () => api.get('/users/me').then((r) => r.data.data),
};
