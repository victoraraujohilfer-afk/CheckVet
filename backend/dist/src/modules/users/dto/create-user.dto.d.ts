import { Role, Specialization } from '@prisma/client';
export declare class CreateUserDto {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    role: Role;
    crmv?: string;
    specialization?: Specialization;
    clinicName?: string;
}
