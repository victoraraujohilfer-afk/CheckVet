import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
export declare class OwnersController {
    private readonly ownersService;
    constructor(ownersService: OwnersService);
    create(dto: CreateOwnerDto): Promise<{
        email: string | null;
        id: string;
        fullName: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
    }>;
    findAll(search?: string, page?: number, limit?: number): Promise<{
        owners: ({
            _count: {
                consultations: number;
            };
            patients: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                ownerId: string;
                species: import(".prisma/client").$Enums.Species;
                breed: string | null;
                gender: import(".prisma/client").$Enums.Gender;
                age: string | null;
                weight: import("@prisma/client/runtime/library").Decimal | null;
            }[];
        } & {
            email: string | null;
            id: string;
            fullName: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        patients: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            ownerId: string;
            species: import(".prisma/client").$Enums.Species;
            breed: string | null;
            gender: import(".prisma/client").$Enums.Gender;
            age: string | null;
            weight: import("@prisma/client/runtime/library").Decimal | null;
        }[];
    } & {
        email: string | null;
        id: string;
        fullName: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
    }>;
    update(id: string, dto: UpdateOwnerDto): Promise<{
        email: string | null;
        id: string;
        fullName: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
    }>;
    remove(id: string): Promise<{
        email: string | null;
        id: string;
        fullName: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
    }>;
}
