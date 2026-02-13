import { PrismaService } from '../../prisma/prisma.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { QueryConsultationDto } from './dto/query-consultation.dto';
import { Prisma } from '@prisma/client';
import { PDFService } from './pdf.service';
export declare class ConsultationsService {
    private prisma;
    private pdfService;
    constructor(prisma: PrismaService, pdfService: PDFService);
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
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            species: import(".prisma/client").$Enums.Species;
            breed: string | null;
            gender: import(".prisma/client").$Enums.Gender;
            age: string | null;
            weight: Prisma.Decimal | null;
        };
        protocol: ({
            items: {
                name: string;
                id: string;
                order: number;
                isRequired: boolean;
                protocolId: string;
            }[];
        } & {
            name: string;
            type: import(".prisma/client").$Enums.ProtocolType;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            veterinarianId: string | null;
        }) | null;
        veterinarian: {
            id: string;
            fullName: string;
            crmv: string | null;
        };
    } & {
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
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                ownerId: string;
                species: import(".prisma/client").$Enums.Species;
                breed: string | null;
                gender: import(".prisma/client").$Enums.Gender;
                age: string | null;
                weight: Prisma.Decimal | null;
            };
            protocol: {
                name: string;
                type: import(".prisma/client").$Enums.ProtocolType;
                id: string;
            } | null;
            veterinarian: {
                id: string;
                fullName: string;
                crmv: string | null;
            };
        } & {
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
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            species: import(".prisma/client").$Enums.Species;
            breed: string | null;
            gender: import(".prisma/client").$Enums.Gender;
            age: string | null;
            weight: Prisma.Decimal | null;
        };
        protocol: ({
            items: {
                name: string;
                id: string;
                order: number;
                isRequired: boolean;
                protocolId: string;
            }[];
        } & {
            name: string;
            type: import(".prisma/client").$Enums.ProtocolType;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            veterinarianId: string | null;
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
        attachments: {
            id: string;
            createdAt: Date;
            consultationId: string;
            fileName: string;
            fileSize: string | null;
            fileType: string | null;
            fileUrl: string;
        }[];
        veterinarian: {
            id: string;
            fullName: string;
            crmv: string | null;
            specialization: import(".prisma/client").$Enums.Specialization | null;
            clinicName: string | null;
            clinicLogoUrl: string | null;
        };
        procedures: {
            name: string;
            value: Prisma.Decimal | null;
            id: string;
            createdAt: Date;
            consultationId: string;
            code: string | null;
        }[];
        checklist: ({
            protocolItem: {
                name: string;
                id: string;
                order: number;
                isRequired: boolean;
                protocolId: string;
            };
        } & {
            id: string;
            completed: boolean;
            completedAt: Date | null;
            notes: string | null;
            aiTranscript: string | null;
            aiConfidence: number | null;
            autoChecked: boolean;
            consultationId: string;
            protocolItemId: string;
        })[];
    } & {
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
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            species: import(".prisma/client").$Enums.Species;
            breed: string | null;
            gender: import(".prisma/client").$Enums.Gender;
            age: string | null;
            weight: Prisma.Decimal | null;
        };
    } & {
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
    }>;
    updateChecklistItem(consultationId: string, itemId: string, dto: UpdateChecklistDto): Promise<{
        id: string;
        completed: boolean;
        completedAt: Date | null;
        notes: string | null;
        aiTranscript: string | null;
        aiConfidence: number | null;
        autoChecked: boolean;
        consultationId: string;
        protocolItemId: string;
    }>;
    remove(id: string): Promise<{
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
    }>;
    generatePDF(id: string): Promise<Buffer>;
    private recalculateAdherence;
}
