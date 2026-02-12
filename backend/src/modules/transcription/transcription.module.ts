import { Module } from '@nestjs/common';
import { TranscriptionController } from './transcription.controller';
import { TranscriptionService } from './transcription.service';
import { WhisperService } from './whisper.service';
import { AIAnalysisService } from './ai-analysis.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { mkdirSync } from 'fs';

// Cria diretório de uploads se não existir
try {
    mkdirSync('./uploads/audio', { recursive: true });
} catch (error) {
    // Ignora se já existe
}

@Module({
    imports: [
        PrismaModule,
        MulterModule.register({
            dest: './uploads/audio',
        }),
    ],
    controllers: [TranscriptionController],
    providers: [TranscriptionService, WhisperService, AIAnalysisService],
    exports: [TranscriptionService],
})
export class TranscriptionModule { }