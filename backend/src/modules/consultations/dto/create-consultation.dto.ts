import { IsString, IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConsultationType } from '@prisma/client';

export class CreateConsultationDto {
  @ApiProperty()
  @IsUUID()
  patientId: string;

  @ApiProperty()
  @IsUUID()
  ownerId: string;

  @ApiProperty({ enum: ConsultationType, example: ConsultationType.ROUTINE })
  @IsEnum(ConsultationType)
  type: ConsultationType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  protocolId?: string;

  @ApiPropertyOptional({ example: 'Animal apresentando apatia e falta de apetite' })
  @IsOptional()
  @IsString()
  chiefComplaint?: string;

  @ApiProperty({ example: '2025-01-15T14:30:00.000Z' })
  @IsDateString()
  date: string;
}
