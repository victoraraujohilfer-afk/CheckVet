import { useState, useRef, useCallback, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
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

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

// Análise automática a cada N frases finais do Deepgram
const AUTO_ANALYZE_EVERY_N_SENTENCES = 10;

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

  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Usamos refs para acessar valores atuais dentro de callbacks do socket
  const transcriptRef = useRef<string>('');
  const finalSentenceCountRef = useRef<number>(0);
  const isAnalyzingRef = useRef<boolean>(false);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
        mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      } catch { /* ignore */ }
      mediaRecorderRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  /**
   * Executa análise automática em background
   */
  const runAutoAnalysis = useCallback(
    async (currentTranscript: string) => {
      if (isAnalyzingRef.current || !currentTranscript) return;
      isAnalyzingRef.current = true;

      try {
        const result = await transcriptionService.analyzeTranscript(
          consultationId,
          currentTranscript
        );
        if (result.itemsChecked > 0) {
          onAnalysisComplete?.(result.itemsChecked);
          toast.success(`${result.itemsChecked} item(ns) marcado(s) automaticamente pela IA!`);
        }
      } catch (err) {
        console.error('Erro na análise automática:', err);
      } finally {
        isAnalyzingRef.current = false;
      }
    },
    [consultationId, onAnalysisComplete]
  );

  /**
   * Solicita consentimento (primeiro passo - só mostra modal)
   */
  const requestConsent = useCallback(() => {
    setState(RecordingState.REQUESTING_CONSENT);
  }, []);

  /**
   * Registra consentimento e inicia gravação com WebSocket se aceito
   */
  const confirmConsent = useCallback(
    async (consent: boolean) => {
      setConsentGiven(consent);

      if (!consent) {
        setState(RecordingState.IDLE);
        toast.error('Consentimento negado. Gravação cancelada.');
        return;
      }

      try {
        // 1. Criar sessão e registrar consentimento via REST
        await transcriptionService.startSession(consultationId);
        await transcriptionService.recordConsent(consultationId, true);

        // 2. Solicitar microfone
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            sampleRate: 16000,
          },
        });

        // 3. Conectar WebSocket ao backend
        const token = localStorage.getItem('accessToken');
        const socket = io(`${SOCKET_URL}/transcription`, {
          transports: ['websocket'],
        });
        socketRef.current = socket;

        // 4. Configurar listeners do socket
        socket.on('connect', () => {
          // Emitir start-stream com consultationId e token JWT
          socket.emit('start-stream', { consultationId, token });
        });

        socket.on('stream-ready', () => {
          // 5. Deepgram pronto — iniciar MediaRecorder
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm;codecs=opus',
          });
          mediaRecorderRef.current = mediaRecorder;

          // Enviar chunks de áudio via socket a cada 250ms
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0 && socketRef.current?.connected) {
              event.data.arrayBuffer().then((buffer) => {
                socketRef.current?.emit('audio-chunk', buffer);
              });
            }
          };

          mediaRecorder.start(250); // timeslice de 250ms
          startTimeRef.current = Date.now();

          // Atualizar duração a cada segundo
          durationIntervalRef.current = setInterval(() => {
            setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
          }, 1000);

          setState(RecordingState.RECORDING);
          toast.success('Gravação iniciada — transcrição em tempo real');
        });

        socket.on('transcript', (data: { text: string; isFinal: boolean }) => {
          if (data.isFinal) {
            // Acumula texto final
            setTranscript((prev) => {
              const updated = prev ? `${prev} ${data.text}` : data.text;
              transcriptRef.current = updated;
              onTranscriptUpdate?.(updated);

              // Auto-análise a cada N frases finais
              finalSentenceCountRef.current += 1;
              if (
                finalSentenceCountRef.current % AUTO_ANALYZE_EVERY_N_SENTENCES === 0 &&
                updated.length > 50
              ) {
                runAutoAnalysis(updated);
              }

              return updated;
            });
          }
          // Interim results: podemos mostrar na UI como texto parcial se quiser
          // Por agora, só usamos os finais para manter o transcript limpo
        });

        socket.on('error', (data: { message: string }) => {
          console.error('Socket error:', data.message);
          toast.error(`Erro na transcrição: ${data.message}`);
        });

        socket.on('disconnect', () => {
          console.log('Socket desconectado');
        });
      } catch (err) {
        console.error('Erro ao iniciar gravação:', err);
        setError('Erro ao acessar microfone. Verifique as permissões.');
        setState(RecordingState.IDLE);
        toast.error('Erro ao iniciar gravação');
      }
    },
    [consultationId, onTranscriptUpdate, runAutoAnalysis]
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
    const finalDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);

    // Para o timer
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    // Para o MediaRecorder
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      mediaRecorderRef.current = null;
    }

    // Pede ao backend para fechar Deepgram e salvar transcript final
    if (socketRef.current?.connected) {
      socketRef.current.emit('stop-stream');
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Finaliza sessão via REST
    await transcriptionService.finishSession(consultationId, finalDuration);

    setDuration(finalDuration);
    setState(RecordingState.FINISHED);
    toast.success('Gravação finalizada');
  }, [consultationId]);

  /**
   * Analisa transcrição manualmente (botão "Analisar com IA")
   */
  const analyzeTranscript = useCallback(async () => {
    const currentTranscript = transcriptRef.current;
    if (!currentTranscript) {
      toast.error('Nenhuma transcrição disponível');
      return;
    }

    setState(RecordingState.ANALYZING);
    toast.info('Analisando transcrição...');

    try {
      const result = await transcriptionService.analyzeTranscript(
        consultationId,
        currentTranscript
      );

      onAnalysisComplete?.(result.itemsChecked);

      if (result.itemsChecked > 0) {
        toast.success(`${result.itemsChecked} item(ns) marcado(s) automaticamente!`);
      } else {
        toast.info('Nenhum item novo identificado');
      }

      setState(RecordingState.FINISHED);
      return result;
    } catch (err) {
      console.error('Erro ao analisar:', err);
      toast.error('Erro ao analisar transcrição');
      setState(RecordingState.FINISHED);
    }
  }, [consultationId, onAnalysisComplete]);

  /**
   * Reseta estado
   */
  const reset = useCallback(() => {
    cleanup();
    setTranscript('');
    setDuration(0);
    setConsentGiven(false);
    setError(null);
    finalSentenceCountRef.current = 0;
    isAnalyzingRef.current = false;
    setState(RecordingState.IDLE);
  }, []);

  return {
    state,
    transcript,
    consentGiven,
    duration,
    error,
    requestConsent,
    confirmConsent,
    pauseRecording,
    resumeRecording,
    stopRecording,
    analyzeTranscript,
    reset,
  };
};
