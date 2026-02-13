import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TranscriptionService } from './transcription.service';
import { AnalyzeTranscriptDto, ConsentDto, StartTranscriptionDto } from './dto/transcription.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Transcription')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transcription')
export class TranscriptionController {
    constructor(private readonly transcriptionService: TranscriptionService) { }

    @Post('start')
    @ApiOperation({ summary: 'Iniciar sessão de transcrição' })
    async startTranscription(
        @Body() dto: StartTranscriptionDto,
        @CurrentUser('id') userId: string,
    ) {
        return this.transcriptionService.startTranscription(dto.consultationId, userId);
    }

    @Post('consent')
    @ApiOperation({ summary: 'Registrar consentimento LGPD' })
    async recordConsent(
        @Body() dto: ConsentDto,
        @CurrentUser('id') userId: string,
    ) {
        return this.transcriptionService.recordConsent(dto, userId);
    }

    @Post('analyze')
    @ApiOperation({ summary: 'Analisar transcrição e auto-marcar checklist' })
    async analyzeTranscript(
        @Body() dto: AnalyzeTranscriptDto,
        @CurrentUser('id') userId: string,
    ) {
        return this.transcriptionService.analyzeAndAutoCheck(dto, userId);
    }

    @Post('finish/:consultationId')
    @ApiOperation({ summary: 'Finalizar transcrição' })
    async finishTranscription(
        @Param('consultationId') consultationId: string,
        @Body('duration') duration: number,
        @CurrentUser('id') userId: string,
    ) {
        return this.transcriptionService.finishTranscription(consultationId, duration, userId);
    }

    @Get(':consultationId')
    @ApiOperation({ summary: 'Obter transcrição de uma consulta' })
    async getTranscription(
        @Param('consultationId') consultationId: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.transcriptionService.getTranscription(consultationId, userId);
    }
}
