import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(userId: string): Promise<{
        id: string;
        email: string;
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
    findAll(query: QueryUserDto, userId: string): Promise<{
        users: {
            id: string;
            email: string;
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
        id: string;
        email: string;
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
    create(dto: CreateUserDto, adminId: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        crmv: string | null;
        specialization: import(".prisma/client").$Enums.Specialization | null;
        clinicName: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
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
