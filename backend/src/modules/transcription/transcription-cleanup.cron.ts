import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TranscriptionService } from './transcription.service';

@Injectable()
export class TranscriptionCleanupCron {
    private readonly logger = new Logger(TranscriptionCleanupCron.name);

    constructor(private readonly transcriptionService: TranscriptionService) { }

    @Cron(CronExpression.EVERY_DAY_AT_3AM)
    async handleCleanup() {
        this.logger.log('Iniciando limpeza de transcrições expiradas...');
        const result = await this.transcriptionService.cleanupExpiredTranscripts();
        this.logger.log(`Limpeza concluída: ${result.deletedCount} transcrição(ões) removida(s)`);
    }
}
