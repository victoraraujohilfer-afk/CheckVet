import { IsString, IsOptional, IsBoolean, IsInt, IsEnum, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BackupFrequency } from '@prisma/client';

export class UpdateSettingsDto {
  @ApiPropertyOptional({ example: 'CheckVet Hospital' })
  @IsOptional()
  @IsString()
  hospitalName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean;

  @ApiPropertyOptional({ example: 80 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  adherenceThreshold?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoBackup?: boolean;

  @ApiPropertyOptional({ enum: BackupFrequency })
  @IsOptional()
  @IsEnum(BackupFrequency)
  backupFrequency?: BackupFrequency;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  requireDocumentation?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  allowEditing?: boolean;
}
