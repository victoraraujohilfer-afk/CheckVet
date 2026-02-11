import {
  ConsultationType,
  ConsultationStatus,
  Species,
  Gender,
  Role,
  Specialization,
  ProtocolType,
  UserStatus,
  BackupFrequency,
} from '@/types/api';

export const consultationTypeLabels: Record<ConsultationType, string> = {
  [ConsultationType.ROUTINE]: 'Rotina',
  [ConsultationType.VACCINATION]: 'Vacinação',
  [ConsultationType.EMERGENCY]: 'Emergência',
  [ConsultationType.SURGERY]: 'Cirurgia',
  [ConsultationType.RETURN]: 'Retorno',
  [ConsultationType.EXAM]: 'Exames',
};

export const consultationStatusLabels: Record<ConsultationStatus, string> = {
  [ConsultationStatus.COMPLETED]: 'Concluída',
  [ConsultationStatus.PENDING]: 'Pendente',
  [ConsultationStatus.IN_PROGRESS]: 'Em Andamento',
};

export const speciesLabels: Record<Species, string> = {
  [Species.CANINE]: 'Canino',
  [Species.FELINE]: 'Felino',
  [Species.AVIAN]: 'Ave',
  [Species.EXOTIC]: 'Exótico',
};

export const genderLabels: Record<Gender, string> = {
  [Gender.MALE]: 'Macho',
  [Gender.FEMALE]: 'Fêmea',
};

export const roleLabels: Record<Role, string> = {
  [Role.ADMIN]: 'Administrador',
  [Role.VETERINARIAN]: 'Veterinário',
  [Role.SUPERVISOR]: 'Supervisor',
  [Role.COORDINATOR]: 'Coordenador',
};

export const specializationLabels: Record<Specialization, string> = {
  [Specialization.GENERAL]: 'Clínica Geral',
  [Specialization.SURGERY]: 'Cirurgia',
  [Specialization.DERMATOLOGY]: 'Dermatologia',
  [Specialization.CARDIOLOGY]: 'Cardiologia',
  [Specialization.ORTHOPEDICS]: 'Ortopedia',
  [Specialization.ONCOLOGY]: 'Oncologia',
};

export const protocolTypeLabels: Record<ProtocolType, string> = {
  [ProtocolType.GENERAL_EXAM]: 'Exame Clínico Geral',
  [ProtocolType.VACCINATION]: 'Vacinação',
  [ProtocolType.EMERGENCY]: 'Emergência',
  [ProtocolType.PRE_SURGERY]: 'Pré-operatório',
  [ProtocolType.POST_SURGERY]: 'Pós-cirúrgico',
};

export const userStatusLabels: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'Ativo',
  [UserStatus.INACTIVE]: 'Inativo',
  [UserStatus.WARNING]: 'Atenção',
};

export const backupFrequencyLabels: Record<BackupFrequency, string> = {
  [BackupFrequency.HOURLY]: 'A cada hora',
  [BackupFrequency.DAILY]: 'Diário',
  [BackupFrequency.WEEKLY]: 'Semanal',
};
