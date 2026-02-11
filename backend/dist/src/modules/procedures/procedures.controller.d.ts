import { ProceduresService } from './procedures.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
export declare class ProceduresController {
    private readonly proceduresService;
    constructor(proceduresService: ProceduresService);
    create(consultationId: string, dto: CreateProcedureDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        consultationId: string;
        code: string | null;
        value: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    findAll(consultationId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        consultationId: string;
        code: string | null;
        value: import("@prisma/client/runtime/library").Decimal | null;
    }[]>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        consultationId: string;
        code: string | null;
        value: import("@prisma/client/runtime/library").Decimal | null;
    }>;
}
