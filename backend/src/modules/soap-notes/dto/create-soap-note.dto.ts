import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSoapNoteDto {
  @ApiPropertyOptional({ example: 'Animal apresentando apatia há 2 dias, sem apetite' })
  @IsOptional()
  @IsString()
  subjective?: string;

  @ApiPropertyOptional({
    example: {
      temperature: '38.5°C',
      heartRate: '90 bpm',
      respiratoryRate: '24 mpm',
      mucosas: 'Normocoradas',
      hydration: 'Normal (TPC < 2s)',
      bodyCondition: '5/9',
      generalExam: 'Sem alterações significativas',
    },
  })
  @IsOptional()
  @IsObject()
  objectiveData?: Record<string, any>;

  @ApiPropertyOptional({ example: 'Suspeita de gastrite' })
  @IsOptional()
  @IsString()
  assessment?: string;

  @ApiPropertyOptional({ example: 'Medicação prescrita, retorno em 7 dias' })
  @IsOptional()
  @IsString()
  plan?: string;
}
