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
        patient: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            name: string;
            species: import(".prisma/client").$Enums.Species;
            breed: string | null;
            gender: import(".prisma/client").$Enums.Gender;
            age: string | null;
            weight: Prisma.Decimal | null;
        };
        owner: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            fullName: string;
            phone: string;
            address: string | null;
        };
        veterinarian: {
            id: string;
            fullName: string;
            crmv: string | null;
        };
        protocol: ({
            items: {
                id: string;
                protocolId: string;
                order: number;
                name: string;
                isRequired: boolean;
            }[];
        } & {
            id: string;
            type: import(".prisma/client").$Enums.ProtocolType;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
        }) | null;
    } & {
        id: string;
        type: import(".prisma/client").$Enums.ConsultationType;
        chiefComplaint: string | null;
        date: Date;
        status: import(".prisma/client").$Enums.ConsultationStatus;
        adherencePercentage: number | null;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        ownerId: string;
        veterinarianId: string;
        protocolId: string | null;
    }>;
    findAll(query: QueryConsultationDto): Promise<{
        consultations: ({
            patient: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                ownerId: string;
                name: string;
                species: import(".prisma/client").$Enums.Species;
                breed: string | null;
                gender: import(".prisma/client").$Enums.Gender;
                age: string | null;
                weight: Prisma.Decimal | null;
            };
            owner: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                fullName: string;
                phone: string;
                address: string | null;
            };
            veterinarian: {
                id: string;
                fullName: string;
                crmv: string | null;
            };
            protocol: {
                id: string;
                type: import(".prisma/client").$Enums.ProtocolType;
                name: string;
            } | null;
        } & {
            id: string;
            type: import(".prisma/client").$Enums.ConsultationType;
            chiefComplaint: string | null;
            date: Date;
            status: import(".prisma/client").$Enums.ConsultationStatus;
            adherencePercentage: number | null;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            ownerId: string;
            veterinarianId: string;
            protocolId: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        patient: {
            owner: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                fullName: string;
                phone: string;
                address: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            name: string;
            species: import(".prisma/client").$Enums.Species;
            breed: string | null;
            gender: import(".prisma/client").$Enums.Gender;
            age: string | null;
            weight: Prisma.Decimal | null;
        };
        owner: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            fullName: string;
            phone: string;
            address: string | null;
        };
        veterinarian: {
            id: string;
            fullName: string;
            crmv: string | null;
            specialization: import(".prisma/client").$Enums.Specialization | null;
        };
        protocol: ({
            items: {
                id: string;
                protocolId: string;
                order: number;
                name: string;
                isRequired: boolean;
            }[];
        } & {
            id: string;
            type: import(".prisma/client").$Enums.ProtocolType;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
        }) | null;
        checklist: ({
            protocolItem: {
                id: string;
                protocolId: string;
                order: number;
                name: string;
                isRequired: boolean;
            };
        } & {
            id: string;
            consultationId: string;
            protocolItemId: string;
            completed: boolean;
            completedAt: Date | null;
            notes: string | null;
        })[];
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
        id: string;
        type: import(".prisma/client").$Enums.ConsultationType;
        chiefComplaint: string | null;
        date: Date;
        status: import(".prisma/client").$Enums.ConsultationStatus;
        adherencePercentage: number | null;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        ownerId: string;
        veterinarianId: string;
        protocolId: string | null;
    }>;
    update(id: string, dto: UpdateConsultationDto): Promise<{
        patient: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            name: string;
            species: import(".prisma/client").$Enums.Species;
            breed: string | null;
            gender: import(".prisma/client").$Enums.Gender;
            age: string | null;
            weight: Prisma.Decimal | null;
        };
        owner: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            fullName: string;
            phone: string;
            address: string | null;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.ConsultationType;
        chiefComplaint: string | null;
        date: Date;
        status: import(".prisma/client").$Enums.ConsultationStatus;
        adherencePercentage: number | null;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        ownerId: string;
        veterinarianId: string;
        protocolId: string | null;
    }>;
    updateChecklistItem(consultationId: string, itemId: string, dto: UpdateChecklistDto): Promise<{
        id: string;
        consultationId: string;
        protocolItemId: string;
        completed: boolean;
        completedAt: Date | null;
        notes: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.ConsultationType;
        chiefComplaint: string | null;
        date: Date;
        status: import(".prisma/client").$Enums.ConsultationStatus;
        adherencePercentage: number | null;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        ownerId: string;
        veterinarianId: string;
        protocolId: string | null;
    }>;
    private recalculateAdherence;
}
