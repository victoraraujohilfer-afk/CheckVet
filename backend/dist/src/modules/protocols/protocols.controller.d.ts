import { ProtocolsService } from './protocols.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
export declare class ProtocolsController {
    private readonly protocolsService;
    constructor(protocolsService: ProtocolsService);
    create(dto: CreateProtocolDto, userId: string): Promise<{
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
        veterinarianId: string | null;
    }>;
    findAll(userId: string, type?: string): Promise<({
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
        veterinarianId: string | null;
    })[]>;
    findOne(id: string, userId: string): Promise<{
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
        veterinarianId: string | null;
    }>;
    update(id: string, dto: UpdateProtocolDto, userId: string): Promise<{
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
        veterinarianId: string | null;
    }>;
    remove(id: string, userId: string): Promise<{
        type: import(".prisma/client").$Enums.ProtocolType;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        veterinarianId: string | null;
    }>;
    hardDelete(id: string, userId: string): Promise<{
        type: import(".prisma/client").$Enums.ProtocolType;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        veterinarianId: string | null;
    }>;
}
