import { ConsultationStatus, ConsultationType } from '@prisma/client';
export declare class QueryConsultationDto {
    veterinarianId?: string;
    patientId?: string;
    status?: ConsultationStatus;
    type?: ConsultationType;
    search?: string;
    page?: number;
    limit?: number;
}
