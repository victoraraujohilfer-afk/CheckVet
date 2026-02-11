import { IsString, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProtocolType } from '@prisma/client';

export class ProtocolItemDto {
  @ApiProperty({ example: 'Anamnese completa' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  order: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  isRequired?: boolean;
}

export class CreateProtocolDto {
  @ApiProperty({ example: 'Exame Clínico Geral' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Protocolo padrão para exame clínico geral' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ProtocolType, example: ProtocolType.GENERAL_EXAM })
  @IsEnum(ProtocolType)
  type: ProtocolType;

  @ApiProperty({ type: [ProtocolItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProtocolItemDto)
  items: ProtocolItemDto[];
}
