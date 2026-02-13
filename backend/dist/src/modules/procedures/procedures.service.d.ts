import { PrismaService } from '../../prisma/prisma.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
export declare class ProceduresService {
    private prisma;
    constructor(prisma: PrismaService);
    create(consultationId: string, dto: CreateProcedureDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        consultationId: string;
        value: import("@prisma/client/runtime/library").Decimal | null;
        code: string | null;
    }>;
    findByConsultation(consultationId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        consultationId: string;
        value: import("@prisma/client/runtime/library").Decimal | null;
        code: string | null;
    }[]>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        consultationId: string;
        value: import("@prisma/client/runtime/library").Decimal | null;
        code: string | null;
    }>;
}
