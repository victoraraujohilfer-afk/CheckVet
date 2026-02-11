import { ConsultationType } from '@prisma/client';
export declare class CreateConsultationDto {
    patientId: string;
    ownerId: string;
    type: ConsultationType;
    protocolId?: string;
    chiefComplaint?: string;
    date: string;
}
