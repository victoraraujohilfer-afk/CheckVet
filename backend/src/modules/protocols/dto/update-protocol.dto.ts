import { IsString, IsOptional, IsEnum, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProtocolType } from '@prisma/client';

export class ProtocolItemDto {
  @ApiPropertyOptional({ example: 'Anamnese completa' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 1 })
  order: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;
}

export class UpdateProtocolDto {
  @ApiPropertyOptional({ example: 'Exame Clínico Geral' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Protocolo padrão para exame clínico geral' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ProtocolType, example: ProtocolType.GENERAL_EXAM })
  @IsOptional()
  @IsEnum(ProtocolType)
  type?: ProtocolType;

  @ApiPropertyOptional({ type: [ProtocolItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProtocolItemDto)
  items?: ProtocolItemDto[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}