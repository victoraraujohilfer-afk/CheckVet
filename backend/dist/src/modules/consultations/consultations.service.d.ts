import { PrismaService } from '../../prisma/prisma.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { QueryConsultationDto } from './dto/query-consultation.dto';
import { Prisma } from '@prisma/client';
export declare class ConsultationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateConsultationDto, veterinarianId: string): Promise<{
        owner: {
            email: string | null;
            id: string;
            fullName: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
        };
        patient: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            ownerId: string;
            species: import(".prisma/client").$Enums.Species;
            breed: string | null;
            gender: import(".prisma/client").$Enums.Gender;
            age: string | null;
            weight: Prisma.Decimal | null;
        };
        protocol: ({
            items: {
                id: string;
                name: string;
                order: number;
                isRequired: boolean;
                protocolId: string;
            }[];
        } & {
            type: import(".prisma/client").$Enums.ProtocolType;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
        }) | null;
        veterinarian: {
            id: string;
            fullName: string;
            crmv: string | null;
        };
    } & {
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
    }>;
    findAll(query: QueryConsultationDto): Promise<{
        consultations: ({
            owner: {
                email: string | null;
                id: string;
                fullName: string;
                phone: string;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
            };
            patient: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                ownerId: string;
                species: import(".prisma/client").$Enums.Species;
                breed: string | null;
                gender: import(".prisma/client").$Enums.Gender;
                age: string | null;
                weight: Prisma.Decimal | null;
            };
            protocol: {
                type: import(".prisma/client").$Enums.ProtocolType;
                id: string;
                name: string;
            } | null;
            veterinarian: {
                id: string;
                fullName: string;
                crmv: string | null;
            };
        } & {
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
        patient: {
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
            weight: Prisma.Decimal | null;
        };
        protocol: ({
            items: {
                id: string;
                name: string;
                order: number;
                isRequired: boolean;
                protocolId: string;
            }[];
        } & {
            type: import(".prisma/client").$Enums.ProtocolType;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
        }) | null;
        soapNote: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            consultationId: string;
            subjective: string | null;
            objectiveData: Prisma.JsonValue | null;
            assessment: string | null;
            plan: string | null;
        } | null;
        veterinarian: {
            id: string;
            fullName: string;
            crmv: string | null;
            specialization: import(".prisma/client").$Enums.Specialization | null;
        };
        checklist: ({
            protocolItem: {
                id: string;
                name: string;
                order: number;
                isRequired: boolean;
                protocolId: string;
            };
        } & {
            id: string;
            completed: boolean;
            completedAt: Date | null;
            notes: string | null;
            consultationId: string;
            protocolItemId: string;
        })[];
        procedures: {
            id: string;
            createdAt: Date;
            name: string;
            consultationId: string;
            code: string | null;
            value: Prisma.Decimal | null;
        }[];
        attachments: {
            id: string;
            createdAt: Date;
            consultationId: string;
            fileName: string;
            fileSize: string | null;
            fileType: string | null;
            fileUrl: string;
        }[];
    } & {
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
    }>;
    update(id: string, dto: UpdateConsultationDto): Promise<{
        owner: {
            email: string | null;
            id: string;
            fullName: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
        };
        patient: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            ownerId: string;
            species: import(".prisma/client").$Enums.Species;
            breed: string | null;
            gender: import(".prisma/client").$Enums.Gender;
            age: string | null;
            weight: Prisma.Decimal | null;
        };
    } & {
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
    }>;
    updateChecklistItem(consultationId: string, itemId: string, dto: UpdateChecklistDto): Promise<{
        id: string;
        completed: boolean;
        completedAt: Date | null;
        notes: string | null;
        consultationId: string;
        protocolItemId: string;
    }>;
    remove(id: string): Promise<{
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
    }>;
    private recalculateAdherence;
}
