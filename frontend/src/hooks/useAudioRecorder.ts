import { useState, useRef, useCallback } from 'react';
import { transcriptionService } from '@/services/transcription.service';
import { toast } from 'sonner';

export enum RecordingState {
  IDLE = 'IDLE',
  REQUESTING_CONSENT = 'REQUESTING_CONSENT',
  RECORDING = 'RECORDING',
  PAUSED = 'PAUSED',
  ANALYZING = 'ANALYZING',
  FINISHED = 'FINISHED',
}

interface UseAudioRecorderProps {
  consultationId: string;
  onTranscriptUpdate?: (text: string) => void;
  onAnalysisComplete?: (itemsChecked: number) => void;
}

export const useAudioRecorder = ({
  consultationId,
  onTranscriptUpdate,
  onAnalysisComplete,
}: UseAudioRecorderProps) => {
  const [state, setState] = useState<RecordingState>(RecordingState.IDLE);
  const [transcript, setTranscript] = useState<string>('');
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  /**
   * Inicia gravação
   */
  const startRecording = useCallback(async () => {
    try {
      setState(RecordingState.REQUESTING_CONSENT);

      // 1. Iniciar sessão no backend
      await transcriptionService.startSession(consultationId);

      // 2. Solicitar permissão do microfone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 3. Configurar MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // 4. Coletar chunks de áudio
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 5. Quando parar, processar o áudio
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];

        // Upload e transcrição
        if (audioBlob.size > 0) {
          try {
            const result = await transcriptionService.uploadAudio(
              consultationId,
              audioBlob
            );
            setTranscript(result.fullTranscript);
            onTranscriptUpdate?.(result.fullTranscript);
          } catch (err) {
            console.error('Erro ao transcrever:', err);
          }
        }
      };

      // 6. Começar gravação
      mediaRecorder.start();
      startTimeRef.current = Date.now();

      // 7. Gravar em chunks de 5 segundos (para enviar ao Whisper periodicamente)
      const chunkInterval = setInterval(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.start();
        }
      }, 5000); // Envia chunk a cada 5 segundos

      // 8. Atualizar duração a cada segundo
      intervalRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

      setState(RecordingState.RECORDING);
      toast.success('Gravação iniciada');

      // Cleanup do interval de chunks
      return () => clearInterval(chunkInterval);
    } catch (err) {
      console.error('Erro ao iniciar gravação:', err);
      setError('Erro ao acessar microfone. Verifique as permissões.');
      setState(RecordingState.IDLE);
      toast.error('Erro ao iniciar gravação');
    }
  }, [consultationId, onTranscriptUpdate]);

  /**
   * Registra consentimento e continua gravação
   */
  const confirmConsent = useCallback(
    async (consent: boolean) => {
      setConsentGiven(consent);
      await transcriptionService.recordConsent(consultationId, consent);

      if (!consent) {
        stopRecording();
        toast.error('Consentimento negado. Gravação cancelada.');
      } else {
        toast.success('Consentimento confirmado');
      }
    },
    [consultationId]
  );

  /**
   * Pausa gravação
   */
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      setState(RecordingState.PAUSED);
      toast.info('Gravação pausada');
    }
  }, []);

  /**
   * Retoma gravação
   */
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      setState(RecordingState.RECORDING);
      toast.info('Gravação retomada');
    }
  }, []);

  /**
   * Para gravação e finaliza
   */
  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      mediaRecorderRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Finalizar no backend
    await transcriptionService.finishSession(consultationId, duration);

    setState(RecordingState.FINISHED);
    toast.success('Gravação finalizada');
  }, [consultationId, duration]);

  /**
   * Analisa transcrição e auto-marca checklist
   */
  const analyzeTranscript = useCallback(async () => {
    if (!transcript) {
      toast.error('Nenhuma transcrição disponível');
      return;
    }

    setState(RecordingState.ANALYZING);
    toast.info('Analisando transcrição...');

    try {
      const result = await transcriptionService.analyzeTranscript(
        consultationId,
        transcript
      );

      onAnalysisComplete?.(result.itemsChecked);

      if (result.itemsChecked > 0) {
        toast.success(`${result.itemsChecked} items marcados automaticamente!`);
      } else {
        toast.info('Nenhum item foi identificado automaticamente');
      }

      setState(RecordingState.FINISHED);
      return result;
    } catch (err) {
      console.error('Erro ao analisar:', err);
      toast.error('Erro ao analisar transcrição');
      setState(RecordingState.FINISHED);
    }
  }, [consultationId, transcript, onAnalysisComplete]);

  /**
   * Reseta estado
   */
  const reset = useCallback(() => {
    setTranscript('');
    setDuration(0);
    setConsentGiven(false);
    setError(null);
    setState(RecordingState.IDLE);
  }, []);

  return {
    state,
    transcript,
    consentGiven,
    duration,
    error,
    startRecording,
    confirmConsent,
    pauseRecording,
    resumeRecording,
    stopRecording,
    analyzeTranscript,
    reset,
  };
};