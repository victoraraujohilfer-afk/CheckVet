import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    UseGuards,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { TranscriptionService } from './transcription.service';
import { AnalyzeTranscriptDto, ConsentDto, StartTranscriptionDto } from './dto/transcription.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
    async recordConsent(@Body() dto: ConsentDto) {
        return this.transcriptionService.recordConsent(dto);
    }

    @Post('upload')
    @ApiOperation({ summary: 'Upload de chunk de áudio para transcrição' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileInterceptor('audio', {
            storage: diskStorage({
                destination: './uploads/audio',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    callback(null, `audio-${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
            limits: {
                fileSize: 25 * 1024 * 1024, // 25MB (limite do Whisper)
            },
        }),
    )
    async uploadAudio(
        @UploadedFile() file: Express.Multer.File,
        @Body('consultationId') consultationId: string,
    ) {
        return this.transcriptionService.transcribeAudioChunk(file, consultationId);
    }

    @Post('analyze')
    @ApiOperation({ summary: 'Analisar transcrição e auto-marcar checklist' })
    async analyzeTranscript(@Body() dto: AnalyzeTranscriptDto) {
        return this.transcriptionService.analyzeAndAutoCheck(dto);
    }

    @Post('finish/:consultationId')
    @ApiOperation({ summary: 'Finalizar transcrição' })
    async finishTranscription(
        @Param('consultationId') consultationId: string,
        @Body('duration') duration: number,
    ) {
        return this.transcriptionService.finishTranscription(consultationId, duration);
    }

    @Get(':consultationId')
    @ApiOperation({ summary: 'Obter transcrição de uma consulta' })
    async getTranscription(@Param('consultationId') consultationId: string) {
        return this.transcriptionService.getTranscription(consultationId);
    }
}