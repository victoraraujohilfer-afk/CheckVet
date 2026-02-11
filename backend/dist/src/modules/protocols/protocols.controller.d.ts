import { ProtocolsService } from './protocols.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
export declare class ProtocolsController {
    private readonly protocolsService;
    constructor(protocolsService: ProtocolsService);
    findAll(type?: string): Promise<({
        items: {
            id: string;
            name: string;
            order: number;
            isRequired: boolean;
            protocolId: string;
        }[];
        _count: {
            consultations: number;
        };
    } & {
        type: import(".prisma/client").$Enums.ProtocolType;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
    })[]>;
    findOne(id: string): Promise<{
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
    }>;
    create(dto: CreateProtocolDto): Promise<{
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
    }>;
    update(id: string, dto: UpdateProtocolDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        type: import(".prisma/client").$Enums.ProtocolType;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
    }>;
}
