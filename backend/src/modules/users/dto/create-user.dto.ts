import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role, Specialization } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'Dr. João Silva' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'joao@checkvet.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: '(11) 98765-4321' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: Role, example: Role.VETERINARIAN })
  @IsEnum(Role)
  role: Role;

  @ApiPropertyOptional({ example: 'SP-12345' })
  @IsOptional()
  @IsString()
  crmv?: string;

  @ApiPropertyOptional({ enum: Specialization, example: Specialization.GENERAL })
  @IsOptional()
  @IsEnum(Specialization)
  specialization?: Specialization;

  @ApiPropertyOptional({ example: 'CheckVet Hospital' })
  @IsOptional()
  @IsString()
  clinicName?: string;
}
