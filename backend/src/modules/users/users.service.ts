import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto, adminId?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email já cadastrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Se um admin está criando, busca os dados do admin
    let clinicName = dto.clinicName;
    let clinicLogoUrl: string | undefined = undefined;

    if (adminId) {
      const admin = await this.prisma.user.findUnique({
        where: { id: adminId },
        select: { clinicName: true, clinicLogoUrl: true, role: true },
      });

      // Valida que admin só pode criar veterinários
      if (admin?.role === 'ADMIN' && dto.role !== 'VETERINARIAN') {
        throw new ConflictException(
          'Administradores só podem criar usuários com função de Veterinário',
        );
      }

      // Se o admin tem uma clínica associada, usa ela para o novo usuário
      if (admin?.clinicName) {
        clinicName = admin.clinicName;
      }

      // Herda a logo da clínica do admin
      if (admin?.clinicLogoUrl) {
        clinicLogoUrl = admin.clinicLogoUrl;
      }
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        phone: dto.phone,
        role: dto.role,
        crmv: dto.crmv,
        specialization: dto.specialization,
        clinicName: clinicName,
        clinicLogoUrl: clinicLogoUrl,
        mustChangePassword: dto.role === 'VETERINARIAN', // Veterinários devem trocar senha no primeiro login
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        crmv: true,
        specialization: true,
        clinicName: true,
        status: true,
        createdAt: true,
      },
    });

    return user;
  }

  async findAll(query: QueryUserDto, currentUserId?: string) {
    const { search, role, status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    // Se um usuário está fazendo a requisição, verifica se é admin
    if (currentUserId) {
      const currentUser = await this.prisma.user.findUnique({
        where: { id: currentUserId },
        select: { role: true, clinicName: true },
      });

      // Admin só vê usuários da mesma clínica
      if (currentUser?.role === 'ADMIN' && currentUser.clinicName) {
        where.clinicName = currentUser.clinicName;
      }
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { crmv: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) where.role = role;
    if (status) where.status = status;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          role: true,
          crmv: true,
          specialization: true,
          clinicName: true,
          status: true,
          lastLogin: true,
          createdAt: true,
          _count: { select: { consultations: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        crmv: true,
        specialization: true,
        clinicName: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { consultations: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        crmv: true,
        specialization: true,
        clinicName: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE' },
      select: { id: true, status: true },
    });
  }
}
