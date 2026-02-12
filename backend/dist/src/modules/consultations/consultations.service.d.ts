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
            id: string;
            email: string | null;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            type: import(".prisma/client").$Enums.ProtocolType;
            isActive: boolean;
            veterinarianId: string | null;
        }) | null;
        veterinarian: {
            id: string;
            fullName: string;
            crmv: string | null;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.ConsultationStatus;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ConsultationType;
        ownerId: string;
        date: Date;
        veterinarianId: string;
        protocolId: string | null;
        patientId: string;
        chiefComplaint: string | null;
        adherencePercentage: number | null;
    }>;
    findAll(query: QueryConsultationDto): Promise<{
        consultations: ({
            owner: {
                id: string;
                email: string | null;
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
                id: string;
                name: string;
                type: import(".prisma/client").$Enums.ProtocolType;
            } | null;
            veterinarian: {
                id: string;
                fullName: string;
                crmv: string | null;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ConsultationStatus;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.ConsultationType;
            ownerId: string;
            date: Date;
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
            id: string;
            email: string | null;
            fullName: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
        };
        patient: {
            owner: {
                id: string;
                email: string | null;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            type: import(".prisma/client").$Enums.ProtocolType;
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
        veterinarian: {
            id: string;
            fullName: string;
            crmv: string | null;
            specialization: import(".prisma/client").$Enums.Specialization | null;
            clinicName: string | null;
            clinicLogoUrl: string | null;
        };
        attachments: {
            id: string;
            createdAt: Date;
            consultationId: string;
            fileName: string;
            fileSize: string | null;
            fileType: string | null;
            fileUrl: string;
        }[];
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
            aiTranscript: string | null;
            aiConfidence: number | null;
            autoChecked: boolean;
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
    } & {
        id: string;
        status: import(".prisma/client").$Enums.ConsultationStatus;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ConsultationType;
        ownerId: string;
        date: Date;
        veterinarianId: string;
        protocolId: string | null;
        patientId: string;
        chiefComplaint: string | null;
        adherencePercentage: number | null;
    }>;
    update(id: string, dto: UpdateConsultationDto): Promise<{
        owner: {
            id: string;
            email: string | null;
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
        id: string;
        status: import(".prisma/client").$Enums.ConsultationStatus;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ConsultationType;
        ownerId: string;
        date: Date;
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
        id: string;
        status: import(".prisma/client").$Enums.ConsultationStatus;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.ConsultationType;
        ownerId: string;
        date: Date;
        veterinarianId: string;
        protocolId: string | null;
        patientId: string;
        chiefComplaint: string | null;
        adherencePercentage: number | null;
    }>;
    generatePDF(id: string): Promise<Buffer>;
    private recalculateAdherence;
}
