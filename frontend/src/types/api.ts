export enum Role {
  ADMIN = 'ADMIN',
  VETERINARIAN = 'VETERINARIAN',
  SUPERVISOR = 'SUPERVISOR',
  COORDINATOR = 'COORDINATOR',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  WARNING = 'WARNING',
}

export enum Species {
  CANINE = 'CANINE',
  FELINE = 'FELINE',
  AVIAN = 'AVIAN',
  EXOTIC = 'EXOTIC',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum ConsultationType {
  ROUTINE = 'ROUTINE',
  VACCINATION = 'VACCINATION',
  EMERGENCY = 'EMERGENCY',
  SURGERY = 'SURGERY',
  RETURN = 'RETURN',
  EXAM = 'EXAM',
}

export enum ConsultationStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
}

export enum ProtocolType {
  GENERAL_EXAM = 'GENERAL_EXAM',
  VACCINATION = 'VACCINATION',
  EMERGENCY = 'EMERGENCY',
  PRE_SURGERY = 'PRE_SURGERY',
  POST_SURGERY = 'POST_SURGERY',
}

export enum Specialization {
  GENERAL = 'GENERAL',
  SURGERY = 'SURGERY',
  DERMATOLOGY = 'DERMATOLOGY',
  CARDIOLOGY = 'CARDIOLOGY',
  ORTHOPEDICS = 'ORTHOPEDICS',
  ONCOLOGY = 'ONCOLOGY',
}

export enum BackupFrequency {
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  crmv?: string;
  specialization?: Specialization;
  clinicName?: string;
  status: UserStatus;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
  _count?: { consultations: number };
}

export interface Owner {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  address?: string;
  patients?: Patient[];
  createdAt?: string;
}

export interface Patient {
  id: string;
  name: string;
  ownerId: string;
  species: Species;
  breed?: string;
  gender: Gender;
  age?: string;
  weight?: number;
  owner?: Owner;
  createdAt?: string;
}

export interface Protocol {
  id: string;
  name: string;
  description?: string;
  type: ProtocolType;
  isActive: boolean;
  items?: ProtocolItem[];
  _count?: { consultations: number };
}

export interface ProtocolItem {
  id: string;
  protocolId: string;
  name: string;
  order: number;
  isRequired: boolean;
}

export interface Consultation {
  id: string;
  patientId: string;
  ownerId: string;
  veterinarianId: string;
  protocolId?: string;
  type: ConsultationType;
  chiefComplaint?: string;
  date: string;
  status: ConsultationStatus;
  adherencePercentage?: number;
  createdAt: string;
  patient?: Patient;
  owner?: Owner;
  veterinarian?: Pick<User, 'id' | 'fullName' | 'crmv' | 'specialization'>;
  protocol?: Protocol;
  checklist?: ConsultationChecklist[];
  soapNote?: SoapNote;
  procedures?: Procedure[];
  attachments?: Attachment[];
}

export interface ConsultationChecklist {
  id: string;
  consultationId: string;
  protocolItemId: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  protocolItem?: ProtocolItem;
}

export interface SoapNote {
  id: string;
  consultationId: string;
  subjective?: string;
  objectiveData?: Record<string, string>;
  assessment?: string;
  plan?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Procedure {
  id: string;
  consultationId: string;
  name: string;
  code?: string;
  value?: number;
  createdAt?: string;
}

export interface Attachment {
  id: string;
  consultationId: string;
  fileName: string;
  fileSize?: string;
  fileType?: string;
  fileUrl: string;
  createdAt?: string;
}

export interface SystemSettings {
  id: string;
  hospitalName: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  adherenceThreshold: number;
  autoBackup: boolean;
  backupFrequency: BackupFrequency;
  requireDocumentation: boolean;
  allowEditing: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Pick<User, 'id' | 'email' | 'fullName' | 'role' | 'crmv' | 'clinicName'>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DashboardAnalytics {
  totalVeterinarians: number;
  activeVeterinarians: number;
  consultationsToday: number;
  totalConsultations: number;
  averageAdherence: number;
  pendingAlerts: number;
}

export interface VetRanking {
  id: string;
  fullName: string;
  crmv?: string;
  specialization?: Specialization;
  status: UserStatus;
  totalConsultations: number;
  averageAdherence: number;
  lastConsultation?: string;
  lastLogin?: string;
}

export interface ProtocolAdherence {
  id: string;
  name: string;
  type: ProtocolType;
  totalConsultations: number;
  averageAdherence: number;
}
