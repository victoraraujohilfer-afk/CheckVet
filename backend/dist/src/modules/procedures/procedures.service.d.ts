import { PrismaService } from '../../prisma/prisma.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
export declare class ProceduresService {
    private prisma;
    constructor(prisma: PrismaService);
    create(consultationId: string, dto: CreateProcedureDto): Promise<{
        name: string;
        value: import("@prisma/client/runtime/library").Decimal | null;
        id: string;
        createdAt: Date;
        consultationId: string;
        code: string | null;
    }>;
    findByConsultation(consultationId: string): Promise<{
        name: string;
        value: import("@prisma/client/runtime/library").Decimal | null;
        id: string;
        createdAt: Date;
        consultationId: string;
        code: string | null;
    }[]>;
    remove(id: string): Promise<{
        name: string;
        value: import("@prisma/client/runtime/library").Decimal | null;
        id: string;
        createdAt: Date;
        consultationId: string;
        code: string | null;
    }>;
}
