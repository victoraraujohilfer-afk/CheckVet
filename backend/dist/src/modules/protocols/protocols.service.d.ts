import { PrismaService } from '../../prisma/prisma.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
export declare class ProtocolsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProtocolDto, veterinarianId: string): Promise<{
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
    }>;
    findAll(veterinarianId: string, type?: string): Promise<({
        items: {
            name: string;
            id: string;
            order: number;
            isRequired: boolean;
            protocolId: string;
        }[];
        _count: {
            consultations: number;
        };
    } & {
        name: string;
        type: import(".prisma/client").$Enums.ProtocolType;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        veterinarianId: string | null;
    })[]>;
    findOne(id: string, veterinarianId: string): Promise<{
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
    }>;
    update(id: string, dto: UpdateProtocolDto, veterinarianId: string): Promise<{
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
    }>;
    remove(id: string, veterinarianId: string): Promise<{
        name: string;
        type: import(".prisma/client").$Enums.ProtocolType;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        veterinarianId: string | null;
    }>;
    hardDelete(id: string, veterinarianId: string): Promise<{
        name: string;
        type: import(".prisma/client").$Enums.ProtocolType;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        veterinarianId: string | null;
    }>;
}
