import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultationsService } from '@/services/consultations.service';
import { usersService } from '@/services/users.service';
import { ownersService } from '@/services/owners.service';
import { patientsService } from '@/services/patients.service';
import { protocolsService } from '@/services/protocols.service';
import { analyticsService } from '@/services/analytics.service';
import { settingsService } from '@/services/settings.service';

// ─── Consultations ──────────────────────────────────────

export function useConsultations(params?: {
  veterinarianId?: string;
  status?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['consultations', params],
    queryFn: () => consultationsService.findAll(params),
  });
}

// ✅ CORRIGIDO: Mudei 'consultations' para 'consultation' (singular)
export function useConsultation(id: string) {
  return useQuery({
    queryKey: ['consultation', id],  // ✅ AGORA BATE COM A INVALIDAÇÃO
    queryFn: () => consultationsService.findOne(id),
    enabled: !!id,
  });
}

export function useCreateConsultation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: consultationsService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['consultations'] }),
  });
}

export function useUpdateConsultation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { chiefComplaint?: string; status?: string } }) =>
      consultationsService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['consultations'] }),
  });
}

export function useUpdateChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      consultationId,
      itemId,
      data,
    }: {
      consultationId: string;
      itemId: string;
      data: { completed: boolean; notes?: string };
    }) => consultationsService.updateChecklistItem(consultationId, itemId, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['consultation', vars.consultationId] });
    },
  });
}

// ─── Users ──────────────────────────────────────────────

export function useUsers(params?: {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersService.findAll(params),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersService.findOne(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => usersService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersService.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

// ─── Owners ─────────────────────────────────────────────

export function useOwners(params?: { search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['owners', params],
    queryFn: () => ownersService.findAll(params),
  });
}

export function useCreateOwner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ownersService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['owners'] }),
  });
}

// ─── Patients ───────────────────────────────────────────

export function usePatients(params?: {
  ownerId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: () => patientsService.findAll(params),
  });
}

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patientsService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['patients'] }),
  });
}

// ─── Analytics ──────────────────────────────────────────

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: analyticsService.getDashboard,
  });
}

export function useVetRanking(limit?: number) {
  return useQuery({
    queryKey: ['analytics', 'veterinarians', limit],
    queryFn: () => analyticsService.getVeterinariansRanking(limit),
  });
}

export function useProtocolAdherence() {
  return useQuery({
    queryKey: ['analytics', 'protocols'],
    queryFn: analyticsService.getProtocolAdherence,
  });
}

// ─── Settings ───────────────────────────────────────────

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.get,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settingsService.update,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
}

// ─── Protocols ───────────────────────────────────

export function useProtocols(type?: string) {
  return useQuery({
    queryKey: ['protocols', type],
    queryFn: () => protocolsService.findAll(type),
  });
}

export function useProtocol(id: string) {
  return useQuery({
    queryKey: ['protocol', id],
    queryFn: () => protocolsService.findOne(id),
    enabled: !!id,
  });
}

export function useCreateProtocol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: protocolsService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['protocols'] }),
  });
}

export function useUpdateProtocol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => protocolsService.update(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['protocols'] });
      qc.invalidateQueries({ queryKey: ['protocol', variables.id] });
    },
  });
}

export function useDeleteProtocol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: protocolsService.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['protocols'] }),
  });
}