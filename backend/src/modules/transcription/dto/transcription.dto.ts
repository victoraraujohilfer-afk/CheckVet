import { IsString, IsBoolean, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// DTO para iniciar gravação
export class StartTranscriptionDto {
    @ApiProperty()
    @IsString()
    consultationId: string;
}

// DTO para enviar chunk de áudio ao Whisper
export class TranscribeAudioDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    audio: Express.Multer.File;

    @ApiProperty()
    @IsString()
    consultationId: string;
}

// DTO para processar transcrição e analisar checklist
export class AnalyzeTranscriptDto {
    @ApiProperty({ example: 'Vou medir a temperatura do Rex agora...' })
    @IsString()
    transcript: string;

    @ApiProperty()
    @IsString()
    consultationId: string;
}

// DTO para confirmar consentimento LGPD
export class ConsentDto {
    @ApiProperty()
    @IsString()
    consultationId: string;

    @ApiProperty()
    @IsBoolean()
    consentGiven: boolean;
}

// Response da análise da IA
export class ChecklistAnalysisResponse {
    @ApiProperty()
    itemsToCheck: {
        itemId: string;
        confidence: number;
        reasoning: string;
    }[];

    @ApiProperty()
    fullAnalysis: string;
}