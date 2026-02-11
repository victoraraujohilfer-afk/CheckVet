import { PrismaService } from '../../prisma/prisma.service';
import { CreateSoapNoteDto } from './dto/create-soap-note.dto';
import { UpdateSoapNoteDto } from './dto/update-soap-note.dto';
export declare class SoapNotesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(consultationId: string, dto: CreateSoapNoteDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        consultationId: string;
        subjective: string | null;
        objectiveData: import("@prisma/client/runtime/library").JsonValue | null;
        assessment: string | null;
        plan: string | null;
    }>;
    findByConsultation(consultationId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        consultationId: string;
        subjective: string | null;
        objectiveData: import("@prisma/client/runtime/library").JsonValue | null;
        assessment: string | null;
        plan: string | null;
    }>;
    update(consultationId: string, dto: UpdateSoapNoteDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        consultationId: string;
        subjective: string | null;
        objectiveData: import("@prisma/client/runtime/library").JsonValue | null;
        assessment: string | null;
        plan: string | null;
    }>;
}
