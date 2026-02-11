import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
            type: import(".prisma/client").$Enums.ConsultationType;
            id: string;
            status: import(".prisma/client").$Enums.ConsultationStatus;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            date: Date;
            patientId: string;
            protocolId: string | null;
            chiefComplaint: string | null;
            veterinarianId: string;
            adherencePercentage: number | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        ownerId: string;
        species: import(".prisma/client").$Enums.Species;
        breed: string | null;
        gender: import(".prisma/client").$Enums.Gender;
        age: string | null;
        weight: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        ownerId: string;
        species: import(".prisma/client").$Enums.Species;
        breed: string | null;
        gender: import(".prisma/client").$Enums.Gender;
        age: string | null;
        weight: import("@prisma/client/runtime/library").Decimal | null;
    }>;
}
