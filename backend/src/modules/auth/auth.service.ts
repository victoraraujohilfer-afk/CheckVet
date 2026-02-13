import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) { }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('Usuário inativo');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
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

  async refreshTokens(refreshToken: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Acesso negado');
    }

    const refreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenValid) {
      throw new ForbiddenException('Acesso negado');
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

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Se mustChangePassword é true, não precisa validar senha atual
    if (!user.mustChangePassword) {
      const passwordValid = await bcrypt.compare(
        currentPassword,
        user.passwordHash,
      );
      if (!passwordValid) {
        throw new UnauthorizedException('Senha atual incorreta');
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

  /**
   * Solicita recuperação de senha
   * Gera token único e envia email com link de reset
   */
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Por segurança, sempre retorna sucesso mesmo se o email não existir
    // Isso previne que atacantes descubram quais emails estão cadastrados
    if (!user) {
      return {
        message: 'Se o email estiver cadastrado, você receberá instruções para recuperar sua senha',
      };
    }

    // Verifica se o usuário está ativo
    if (user.status !== 'ACTIVE') {
      return {
        message: 'Se o email estiver cadastrado, você receberá instruções para recuperar sua senha',
      };
    }

    // Gera token seguro e único
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash do token para armazenar no banco (segurança adicional)
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Token expira em 1 hora
    const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

    // Atualiza usuário com token e expiração
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken,
        resetPasswordExpires,
      },
    });

    // Envia email com token original (não o hash)
    try {
      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.fullName,
        resetToken,
      );
    } catch (error) {
      console.error('Erro ao enviar email de recuperação:', error);
      // Em produção, você pode querer reverter a atualização do token
      // ou usar uma fila de emails para retry
    }

    return {
      message: 'Se o email estiver cadastrado, você receberá instruções para recuperar sua senha',
    };
  }

  /**
   * Reseta a senha usando o token enviado por email
   */
  async resetPassword(dto: ResetPasswordDto) {
    // Hash do token recebido para comparar com o armazenado
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(dto.token)
      .digest('hex');

    // Busca usuário com token válido e não expirado
    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken,
        resetPasswordExpires: {
          gt: new Date(), // Token não expirado
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    // Valida que o usuário está ativo
    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('Usuário inativo');
    }

    // Hash da nova senha
    const newPasswordHash = await bcrypt.hash(dto.newPassword, 12);

    // Atualiza senha e remove token de reset
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        mustChangePassword: false, // Remove flag de troca obrigatória se existir
        refreshToken: null, // Invalida sessões existentes
      },
    });

    // Envia email de confirmação
    try {
      await this.emailService.sendPasswordChangedConfirmation(
        user.email,
        user.fullName,
      );
    } catch (error) {
      console.error('Erro ao enviar email de confirmação:', error);
      // Não falha a operação se o email de confirmação falhar
    }

    return {
      message: 'Senha redefinida com sucesso. Você já pode fazer login com sua nova senha.',
    };
  }

  /**
   * Valida se um token de reset é válido (útil para validação no frontend)
   */
  async validateResetToken(token: string) {
    console.log('[DEBUG] Token recebido:', token);
    console.log('[DEBUG] Token length:', token?.length);

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    console.log('[DEBUG] Token hash (SHA256):', resetPasswordToken);

    // Primeiro busca SEM filtro de data para saber se o token existe
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
      throw new BadRequestException('Token inválido ou expirado');
    }

    return {
      valid: true,
      email: user.email,
      fullName: user.fullName,
    };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION') || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn:
          this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}