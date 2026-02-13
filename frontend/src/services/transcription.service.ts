import { api } from '@/lib/api';

export interface TranscriptionSession {
    id: string;
    consultationId: string;
    transcript: string;
    consentGiven: boolean;
    startedAt: string;
    finishedAt?: string;
}

export interface AnalysisResult {
    itemsChecked: number;
    analysis: string;
    items: {
        itemId: string;
        confidence: number;
        reasoning: string;
        transcript: string;
    }[];
}

export const transcriptionService = {
    // Iniciar sessão de transcrição
    startSession: (consultationId: string) =>
        api
            .post<{ data: TranscriptionSession }>('/transcription/start', { consultationId })
            .then((r) => r.data.data),

    // Registrar consentimento LGPD
    recordConsent: (consultationId: string, consentGiven: boolean) =>
        api
            .post('/transcription/consent', { consultationId, consentGiven })
            .then((r) => r.data),

    // Analisar transcrição e auto-marcar checklist
    analyzeTranscript: (consultationId: string, transcript: string) =>
        api
            .post<{ data: AnalysisResult }>('/transcription/analyze', {
                consultationId,
                transcript,
            })
            .then((r) => r.data.data),

    // Finalizar transcrição
    finishSession: (consultationId: string, duration: number) =>
        api
            .post(`/transcription/finish/${consultationId}`, { duration })
            .then((r) => r.data),

    // Buscar transcrição existente
    getTranscription: (consultationId: string) =>
        api
            .get<{ data: TranscriptionSession }>(`/transcription/${consultationId}`)
            .then((r) => r.data.data),
};
