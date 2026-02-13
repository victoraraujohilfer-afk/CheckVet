import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Pause, Play, Sparkles, X } from "lucide-react";
import { useAudioRecorder, RecordingState } from "@/hooks/useAudioRecorder";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ConsentModal from "./ConsentModal";
import TranscriptDisplay from "./TranscriptDisplay";

interface TranscriptionRecorderProps {
    consultationId: string;
    onClose?: () => void;
}

const TranscriptionRecorder = ({
    consultationId,
    onClose,
}: TranscriptionRecorderProps) => {
    const queryClient = useQueryClient();
    const [showConsentModal, setShowConsentModal] = useState(false);

    const {
        state,
        transcript,
        duration,
        requestConsent,
        confirmConsent,
        pauseRecording,
        resumeRecording,
        stopRecording,
        analyzeTranscript,
        reset,
    } = useAudioRecorder({
        consultationId,
        onTranscriptUpdate: (text) => {
            console.log('Transcrição atualizada:', text);
        },
        onAnalysisComplete: (itemsChecked) => {
            // Invalida cache para atualizar checklist
            queryClient.invalidateQueries({ queryKey: ['consultation', consultationId] });
            toast.success(`${itemsChecked} items marcados automaticamente!`);
        },
    });

    const handleStart = () => {
        setShowConsentModal(true);
        requestConsent();
    };

    const handleConsent = async (consent: boolean) => {
        setShowConsentModal(false);
        await confirmConsent(consent);

        if (!consent) {
            reset();
        }
    };

    const handleStop = async () => {
        await stopRecording();
    };

    const handleAnalyze = async () => {
        await analyzeTranscript();
    };

    const handleClose = () => {
        if (state === RecordingState.RECORDING) {
            toast.error('Pare a gravação antes de fechar');
            return;
        }
        reset();
        onClose?.();
    };

    const getStateLabel = () => {
        switch (state) {
            case RecordingState.IDLE:
                return 'Pronto';
            case RecordingState.REQUESTING_CONSENT:
                return 'Aguardando consentimento';
            case RecordingState.RECORDING:
                return 'Gravando';
            case RecordingState.PAUSED:
                return 'Pausado';
            case RecordingState.ANALYZING:
                return 'Analisando com IA';
            case RecordingState.FINISHED:
                return 'Finalizado';
        }
    };

    const getStateBadgeVariant = () => {
        switch (state) {
            case RecordingState.RECORDING:
                return 'destructive';
            case RecordingState.ANALYZING:
                return 'default';
            case RecordingState.FINISHED:
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <>
            <Card className="border-2">
                <CardContent className="p-6">
                    <div className="space-y-6">
                        {/* Header com Status */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center ${state === RecordingState.RECORDING
                                            ? 'bg-red-100 animate-pulse'
                                            : 'bg-primary/10'
                                        }`}
                                >
                                    <Mic
                                        className={`h-6 w-6 ${state === RecordingState.RECORDING
                                                ? 'text-red-600'
                                                : 'text-primary'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Transcrição Automática</h3>
                                    <Badge variant={getStateBadgeVariant()}>{getStateLabel()}</Badge>
                                </div>
                            </div>

                            {onClose && (
                                <Button variant="ghost" size="icon" onClick={handleClose}>
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Controles de Gravação */}
                        <div className="flex items-center gap-2">
                            {state === RecordingState.IDLE && (
                                <Button onClick={handleStart} className="flex-1">
                                    <Mic className="h-4 w-4 mr-2" />
                                    Iniciar Atendimento
                                </Button>
                            )}

                            {state === RecordingState.RECORDING && (
                                <>
                                    <Button onClick={pauseRecording} variant="outline">
                                        <Pause className="h-4 w-4 mr-2" />
                                        Pausar
                                    </Button>
                                    <Button onClick={handleStop} variant="destructive">
                                        <Square className="h-4 w-4 mr-2" />
                                        Finalizar
                                    </Button>
                                </>
                            )}

                            {state === RecordingState.PAUSED && (
                                <>
                                    <Button onClick={resumeRecording}>
                                        <Play className="h-4 w-4 mr-2" />
                                        Retomar
                                    </Button>
                                    <Button onClick={handleStop} variant="destructive">
                                        <Square className="h-4 w-4 mr-2" />
                                        Finalizar
                                    </Button>
                                </>
                            )}

                            {state === RecordingState.FINISHED && (
                                <>
                                    <Button onClick={handleAnalyze} disabled={!transcript}>
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Analisar com IA
                                    </Button>
                                    <Button onClick={reset} variant="outline">
                                        Nova Gravação
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Display da Transcrição */}
                        {(state === RecordingState.RECORDING ||
                            state === RecordingState.PAUSED ||
                            state === RecordingState.ANALYZING ||
                            state === RecordingState.FINISHED) && (
                                <TranscriptDisplay
                                    transcript={transcript}
                                    duration={duration}
                                    isAnalyzing={state === RecordingState.ANALYZING}
                                />
                            )}

                        {/* Instruções */}
                        {state === RecordingState.IDLE && (
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    <strong>Como funciona:</strong>
                                </p>
                                <ol className="text-sm text-muted-foreground space-y-1 pl-4 list-decimal mt-2">
                                    <li>Clique em "Iniciar Atendimento"</li>
                                    <li>Confirme o consentimento LGPD</li>
                                    <li>Realize a consulta normalmente</li>
                                    <li>A IA vai marcar itens do checklist automaticamente</li>
                                    <li>Revise e ajuste se necessário</li>
                                </ol>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Modal de Consentimento */}
            <ConsentModal isOpen={showConsentModal} onConsent={handleConsent} />
        </>
    );
};

export default TranscriptionRecorder;