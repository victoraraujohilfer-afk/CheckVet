import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto, adminId?: string): Promise<{
        email: string;
        id: string;
        fullName: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        crmv: string | null;
        specialization: import(".prisma/client").$Enums.Specialization | null;
        clinicName: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
    }>;
    findAll(query: QueryUserDto, currentUserId?: string): Promise<{
        users: {
            email: string;
            id: string;
            fullName: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            crmv: string | null;
            specialization: import(".prisma/client").$Enums.Specialization | null;
            clinicName: string | null;
            status: import(".prisma/client").$Enums.UserStatus;
            lastLogin: Date | null;
            createdAt: Date;
            _count: {
                consultations: number;
            };
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        email: string;
        id: string;
        fullName: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        crmv: string | null;
        specialization: import(".prisma/client").$Enums.Specialization | null;
        clinicName: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            consultations: number;
        };
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        email: string;
        id: string;
        fullName: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        crmv: string | null;
        specialization: import(".prisma/client").$Enums.Specialization | null;
        clinicName: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.UserStatus;
    }>;
}
