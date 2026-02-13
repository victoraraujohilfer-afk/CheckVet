"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService, emailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        if (user.status !== 'ACTIVE') {
            throw new common_1.ForbiddenException('Usuário inativo');
        }
        const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                refreshToken: await bcrypt.hash(tokens.refreshToken, 12),
                lastLogin: new Date(),
            },
        });
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                crmv: user.crmv,
                clinicName: user.clinicName,
                mustChangePassword: user.mustChangePassword,
            },
        };
    }
    async refreshTokens(refreshToken, userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || !user.refreshToken) {
            throw new common_1.ForbiddenException('Acesso negado');
        }
        const refreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!refreshTokenValid) {
            throw new common_1.ForbiddenException('Acesso negado');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                refreshToken: await bcrypt.hash(tokens.refreshToken, 12),
            },
        });
        return tokens;
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Usuário não encontrado');
        }
        if (!user.mustChangePassword) {
            const passwordValid = await bcrypt.compare(currentPassword, user.passwordHash);
            if (!passwordValid) {
                throw new common_1.UnauthorizedException('Senha atual incorreta');
            }
        }
        const newPasswordHash = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash: newPasswordHash,
                mustChangePassword: false,
            },
        });
        return { message: 'Senha alterada com sucesso' };
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            return {
                message: 'Se o email estiver cadastrado, você receberá instruções para recuperar sua senha',
            };
        }
        if (user.status !== 'ACTIVE') {
            return {
                message: 'Se o email estiver cadastrado, você receberá instruções para recuperar sua senha',
            };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken,
                resetPasswordExpires,
            },
        });
        try {
            await this.emailService.sendPasswordResetEmail(user.email, user.fullName, resetToken);
        }
        catch (error) {
            console.error('Erro ao enviar email de recuperação:', error);
        }
        return {
            message: 'Se o email estiver cadastrado, você receberá instruções para recuperar sua senha',
        };
    }
    async resetPassword(dto) {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(dto.token)
            .digest('hex');
        const user = await this.prisma.user.findFirst({
            where: {
                resetPasswordToken,
                resetPasswordExpires: {
                    gt: new Date(),
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Token inválido ou expirado');
        }
        if (user.status !== 'ACTIVE') {
            throw new common_1.ForbiddenException('Usuário inativo');
        }
        const newPasswordHash = await bcrypt.hash(dto.newPassword, 12);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: newPasswordHash,
                resetPasswordToken: null,
                resetPasswordExpires: null,
                mustChangePassword: false,
                refreshToken: null,
            },
        });
        try {
            await this.emailService.sendPasswordChangedConfirmation(user.email, user.fullName);
        }
        catch (error) {
            console.error('Erro ao enviar email de confirmação:', error);
        }
        return {
            message: 'Senha redefinida com sucesso. Você já pode fazer login com sua nova senha.',
        };
    }
    async validateResetToken(token) {
        console.log('[DEBUG] Token recebido:', token);
        console.log('[DEBUG] Token length:', token?.length);
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        console.log('[DEBUG] Token hash (SHA256):', resetPasswordToken);
        const userWithoutDateFilter = await this.prisma.user.findFirst({
            where: { resetPasswordToken },
            select: {
                email: true,
                fullName: true,
                resetPasswordToken: true,
                resetPasswordExpires: true,
            },
        });
        console.log('[DEBUG] Usuário encontrado (sem filtro de data):', userWithoutDateFilter);
        console.log('[DEBUG] Data atual:', new Date().toISOString());
        console.log('[DEBUG] Token expira em:', userWithoutDateFilter?.resetPasswordExpires?.toISOString());
        const user = await this.prisma.user.findFirst({
            where: {
                resetPasswordToken,
                resetPasswordExpires: {
                    gt: new Date(),
                },
            },
            select: {
                email: true,
                fullName: true,
            },
        });
        console.log('[DEBUG] Usuário encontrado (com filtro de data):', user);
        if (!user) {
            throw new common_1.BadRequestException('Token inválido ou expirado');
        }
        return {
            valid: true,
            email: user.email,
            fullName: user.fullName,
        };
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRATION') || '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
            }),
        ]);
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map