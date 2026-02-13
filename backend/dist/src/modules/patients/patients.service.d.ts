import { PrismaService } from '../../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
export declare class PatientsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePatientDto): Promise<{
        owner: {
            email: string | null;
            id: string;
            fullName: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        species: import(".prisma/client").$Enums.Species;
        breed: string | null;
        gender: import(".prisma/client").$Enums.Gender;
        age: string | null;
        weight: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    findAll(ownerId?: string, search?: string, page?: number, limit?: number): Promise<{
        patients: ({
            owner: {
                email: string | null;
                id: string;
                fullName: string;
                phone: string;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            species: import(".prisma/client").$Enums.Species;
            breed: string | null;
            gender: import(".prisma/client").$Enums.Gender;
            age: string | null;
            weight: import("@prisma/client/runtime/library").Decimal | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        owner: {
            email: string | null;
            id: string;
            fullName: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
        };
        consultations: {
            date: Date;
            type: import(".prisma/client").$Enums.ConsultationType;
            id: string;
            status: import(".prisma/client").$Enums.ConsultationStatus;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            veterinarianId: string;
            protocolId: string | null;
            patientId: string;
            chiefComplaint: string | null;
            adherencePercentage: number | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        species: import(".prisma/client").$Enums.Species;
        breed: string | null;
        gender: import(".prisma/client").$Enums.Gender;
        age: string | null;
        weight: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    update(id: string, dto: UpdatePatientDto): Promise<{
        owner: {
            email: string | null;
            id: string;
            fullName: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        species: import(".prisma/client").$Enums.Species;
        breed: string | null;
        gender: import(".prisma/client").$Enums.Gender;
        age: string | null;
        weight: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        species: import(".prisma/client").$Enums.Species;
        breed: string | null;
        gender: import(".prisma/client").$Enums.Gender;
        age: string | null;
        weight: import("@prisma/client/runtime/library").Decimal | null;
    }>;
}
