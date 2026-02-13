import { ProceduresService } from './procedures.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
export declare class ProceduresController {
    private readonly proceduresService;
    constructor(proceduresService: ProceduresService);
    create(consultationId: string, dto: CreateProcedureDto): Promise<{
        name: string;
        value: import("@prisma/client/runtime/library").Decimal | null;
        id: string;
        createdAt: Date;
        consultationId: string;
        code: string | null;
    }>;
    findAll(consultationId: string): Promise<{
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
