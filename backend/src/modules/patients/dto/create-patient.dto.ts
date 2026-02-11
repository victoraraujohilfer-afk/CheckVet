import { IsString, IsOptional, IsEnum, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Species, Gender } from '@prisma/client';

export class CreatePatientDto {
  @ApiProperty({ example: 'Rex' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'uuid-do-tutor' })
  @IsUUID()
  ownerId: string;

  @ApiProperty({ enum: Species, example: Species.CANINE })
  @IsEnum(Species)
  species: Species;

  @ApiPropertyOptional({ example: 'Golden Retriever' })
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional({ example: '3 anos' })
  @IsOptional()
  @IsString()
  age?: string;

  @ApiPropertyOptional({ example: 25.5 })
  @IsOptional()
  @IsNumber()
  weight?: number;
}
