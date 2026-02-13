import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface ForgotPasswordRequest {
    email: string;
}

interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

interface ValidateTokenResponse {
    valid: boolean;
    email: string;
    fullName: string;
}

/**
 * Hook para solicitar recuperação de senha
 */
export function useForgotPassword() {
    return useMutation({
        mutationFn: async (data: ForgotPasswordRequest) => {
            const response = await axios.post(`${API_URL}/auth/forgot-password`, data);
            return response.data?.data || response.data;
        },
    });
}

/**
 * Hook para resetar senha com token
 */
export function useResetPassword() {
    return useMutation({
        mutationFn: async (data: ResetPasswordRequest) => {
            const response = await axios.post(`${API_URL}/auth/reset-password`, data);
            return response.data?.data || response.data;
        },
    });
}

/**
 * Hook para validar token de recuperação
 */
export function useValidateResetToken(token: string | null) {
    return useQuery<ValidateTokenResponse>({
        queryKey: ['validate-reset-token', token],
        queryFn: async () => {
            if (!token) {
                throw new Error('Token não fornecido');
            }
            const response = await axios.get(
                `${API_URL}/auth/validate-reset-token`,
                { params: { token } }
            );
            return response.data?.data || response.data;
        },
        enabled: !!token,
        retry: false,
    });
}