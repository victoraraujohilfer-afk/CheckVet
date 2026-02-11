import { ConsultationStatus } from '@prisma/client';
export declare class UpdateConsultationDto {
    chiefComplaint?: string;
    status?: ConsultationStatus;
}
