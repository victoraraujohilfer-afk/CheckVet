import { Injectable, BadRequestException } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';

@Injectable()
export class WhisperService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    /**
     * Transcreve áudio usando Whisper API
     */
    async transcribeAudio(audioFile: Express.Multer.File): Promise<string> {
        try {
            // Whisper aceita: mp3, mp4, mpeg, mpga, m4a, wav, webm
            const allowedFormats = ['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm'];
            const fileExt = audioFile.originalname.split('.').pop()?.toLowerCase();

            if (!fileExt || !allowedFormats.includes(fileExt)) {
                throw new BadRequestException(
                    `Formato de áudio não suportado. Use: ${allowedFormats.join(', ')}`
                );
            }

            // Verifica tamanho (Whisper tem limite de 25MB)
            if (audioFile.size > 25 * 1024 * 1024) {
                throw new BadRequestException('Arquivo muito grande. Máximo: 25MB');
            }

            // Cria stream do arquivo
            const fileStream = fs.createReadStream(audioFile.path);

            // Chama Whisper API
            const transcription = await this.openai.audio.transcriptions.create({
                file: fileStream,
                model: 'whisper-1',
                language: 'pt', // Português
                response_format: 'text',
                temperature: 0.2, // Mais conservador = mais preciso
            });

            // Remove arquivo temporário
            fs.unlinkSync(audioFile.path);

            return transcription as string;
        } catch (error) {
            // Limpa arquivo em caso de erro
            if (audioFile?.path && fs.existsSync(audioFile.path)) {
                fs.unlinkSync(audioFile.path);
            }

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(
                `Erro ao transcrever áudio: ${error.message}`
            );
        }
    }

    /**
     * Transcreve com timestamps (para features futuras)
     */
    async transcribeWithTimestamps(audioFile: Express.Multer.File) {
        try {
            const fileStream = fs.createReadStream(audioFile.path);

            const transcription = await this.openai.audio.transcriptions.create({
                file: fileStream,
                model: 'whisper-1',
                language: 'pt',
                response_format: 'verbose_json',
                timestamp_granularities: ['segment'],
            });

            fs.unlinkSync(audioFile.path);

            return transcription;
        } catch (error) {
            if (audioFile?.path && fs.existsSync(audioFile.path)) {
                fs.unlinkSync(audioFile.path);
            }
            throw new BadRequestException(`Erro ao transcrever: ${error.message}`);
        }
    }
}