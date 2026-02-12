import { ProtocolType } from '@prisma/client';
export declare class ProtocolItemDto {
    name: string;
    order: number;
    isRequired?: boolean;
}
export declare class UpdateProtocolDto {
    name?: string;
    description?: string;
    type?: ProtocolType;
    items?: ProtocolItemDto[];
    isActive?: boolean;
}
