import { Role, UserStatus } from '@prisma/client';
export declare class QueryUserDto {
    search?: string;
    role?: Role;
    status?: UserStatus;
    page?: number;
    limit?: number;
}
