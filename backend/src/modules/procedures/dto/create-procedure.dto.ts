import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProcedureDto {
  @ApiProperty({ example: 'Vacina V10' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'VAC-001' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: 120.0 })
  @IsOptional()
  @IsNumber()
  value?: number;
}
