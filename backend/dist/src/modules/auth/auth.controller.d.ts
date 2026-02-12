import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.Role;
            crmv: string | null;
            clinicName: string | null;
            mustChangePassword: boolean;
        };
    }>;
    refresh(dto: RefreshTokenDto, userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    changePassword(userId: string, dto: {
        currentPassword?: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
