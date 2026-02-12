import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Download,
    Edit,
    CheckCircle2,
    AlertCircle,
    Calendar,
    Clock,
    User,
    Stethoscope,
    FileText,
    ClipboardList,
    Activity,
    Loader2,
    Mic,
} from "lucide-react";
import VetSidebar from "@/components/layout/VetSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useConsultation, useUpdateChecklist } from "@/hooks/useApiHooks";
import { consultationTypeLabels, consultationStatusLabels } from "@/utils/enum-labels";
import { formatDate, formatTime, formatDateTime, formatCurrency, getInitials } from "@/utils/format";
import { ConsultationStatus } from "@/types/api";
import TranscriptionRecorder from "@/components/transcription/TranscriptionRecorder";
import ChecklistWithAI from "@/components/transcription/ChecklistWithAI";
import { consultationsService } from "@/services/consultations.service";
import { toast } from "sonner";

const ConsultationDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();

    // Estado para controlar transcrição
    const [showTranscription, setShowTranscription] = useState(false);
    const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

    const { data: consultation, isLoading } = useConsultation(id ?? "");
    const toggleMutation = useUpdateChecklist();

    const completedItems = consultation?.checklist?.filter((item) => item.completed).length ?? 0;
    const totalItems = consultation?.checklist?.length ?? 0;
    const adherencePercentage =
        totalItems > 0
            ? Math.round((completedItems / totalItems) * 100)
            : consultation?.adherencePercentage ?? 0;

    const isCompleted = consultation?.status === ConsultationStatus.COMPLETED;

    const totalProceduresValue =
        consultation?.procedures?.reduce((sum, p) => sum + (p.value ?? 0), 0) ?? 0;

    // ✅ CORRIGIDO: Handler com itemId e data wrapper
    const handleChecklistToggle = (itemId: string, currentState: boolean) => {
        if (!id) return;

        toggleMutation.mutate({
            consultationId: id,
            itemId: itemId,
            data: {
                completed: !currentState,
            },
        });
    };

    const handleDownloadPDF = async () => {
        if (!id || !consultation) return;

        setIsDownloadingPDF(true);
        try {
            await consultationsService.downloadPDF(id, consultation.patient?.name ?? "paciente");
            toast.success("PDF baixado com sucesso!");
        } catch (error) {
            console.error("Erro ao baixar PDF:", error);
            toast.error("Erro ao baixar o PDF. Tente novamente.");
        } finally {
            setIsDownloadingPDF(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted/30">
            <VetSidebar
                userName={user?.fullName ?? ""}
                userRole="Veterinário"
                userInitials={getInitials(user?.fullName ?? "")}
            />

            <main className="ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/vet/history")}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-foreground">
                                    Detalhes da Consulta
                                </h1>
                                <p className="text-muted-foreground">
                                    Prontuário completo e histórico
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                </Button>
                                <Button onClick={handleDownloadPDF} disabled={isDownloadingPDF}>
                                    {isDownloadingPDF ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Download className="h-4 w-4 mr-2" />
                                    )}
                                    {isDownloadingPDF ? "Gerando PDF..." : "Baixar PDF"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {isLoading || !consultation ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <>
                            {/* Status Card */}
                            <Card className="mb-6 border-2">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-16 h-16 rounded-full flex items-center justify-center ${isCompleted ? "bg-green-100" : "bg-orange-100"
                                                    }`}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                                                ) : (
                                                    <AlertCircle className="h-8 w-8 text-orange-600" />
                                                )}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-foreground mb-1">
                                                    {consultation.patient?.name ?? "—"}
                                                </h2>
                                                <p className="text-muted-foreground">
                                                    {consultation.patient?.breed ?? "—"} •{" "}
                                                    {consultation.patient?.age ?? "—"} •{" "}
                                                    {consultation.patient?.weight
                                                        ? `${consultation.patient.weight} kg`
                                                        : "—"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div
                                                className={`text-5xl font-bold mb-1 ${adherencePercentage >= 90
                                                        ? "text-green-600"
                                                        : adherencePercentage >= 70
                                                            ? "text-orange-600"
                                                            : "text-red-600"
                                                    }`}
                                            >
                                                {adherencePercentage}%
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Aderência ao Protocolo
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {completedItems} de {totalItems} itens
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Grid com informações */}
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                {/* Informações do Tutor */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            Informações do Tutor
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Nome</p>
                                            <p className="font-medium">{consultation.owner?.fullName ?? "—"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Telefone</p>
                                            <p className="font-medium">{consultation.owner?.phone ?? "—"}</p>
                                        </div>
                                        {consultation.owner?.email && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Email</p>
                                                <p className="font-medium">{consultation.owner.email}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Informações da Consulta */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Stethoscope className="h-5 w-5" />
                                            Informações da Consulta
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Data</p>
                                            <p className="font-medium flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {formatDate(consultation.date)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Status</p>
                                            <Badge
                                                variant={isCompleted ? "default" : "secondary"}
                                                className="mt-1"
                                            >
                                                {consultationStatusLabels[consultation.status]}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Tipo</p>
                                            <p className="font-medium">
                                                {consultationTypeLabels[consultation.type]}
                                            </p>
                                        </div>
                                        {consultation.chiefComplaint && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Queixa Principal</p>
                                                <p className="font-medium">{consultation.chiefComplaint}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Nota SOAP */}
                            {consultation.soapNote && (
                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Activity className="h-5 w-5" />
                                            Nota SOAP
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm font-semibold text-muted-foreground mb-2">
                                                S - Subjetivo
                                            </p>
                                            <div className="text-sm text-muted-foreground pl-4 whitespace-pre-line">
                                                {consultation.soapNote.subjective ?? "Não registrado"}
                                            </div>
                                        </div>
                                        <Separator />
                                        <div>
                                            <p className="text-sm font-semibold text-muted-foreground mb-2">
                                                O - Objetivo
                                            </p>
                                            <div className="text-sm text-muted-foreground pl-4">
                                                {consultation.soapNote.objectiveData
                                                    ? Object.entries(consultation.soapNote.objectiveData).map(
                                                        ([key, value]) => (
                                                            <p key={key}>
                                                                <span className="font-medium">{key}:</span> {String(value)}
                                                            </p>
                                                        )
                                                    )
                                                    : "Não registrado"}
                                            </div>
                                        </div>
                                        <Separator />
                                        <div>
                                            <p className="text-sm font-semibold text-muted-foreground mb-2">
                                                A - Avaliação
                                            </p>
                                            <div className="text-sm text-muted-foreground pl-4 whitespace-pre-line">
                                                {consultation.soapNote.assessment ?? "Não registrado"}
                                            </div>
                                        </div>
                                        <Separator />
                                        <div>
                                            <p className="text-sm font-semibold text-muted-foreground mb-2">
                                                P - Plano
                                            </p>
                                            <div className="text-sm text-muted-foreground pl-4 whitespace-pre-line">
                                                {consultation.soapNote.plan ?? "Não registrado"}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* ✨ SEÇÃO DE TRANSCRIÇÃO + CHECKLIST COM IA */}
                            {consultation.checklist && consultation.checklist.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-semibold">Checklist do Protocolo</h2>

                                        {!isCompleted && (
                                            <Button
                                                onClick={() => setShowTranscription(!showTranscription)}
                                                variant={showTranscription ? "secondary" : "default"}
                                                className="gap-2"
                                            >
                                                <Mic className="h-4 w-4" />
                                                {showTranscription
                                                    ? "Fechar Transcrição"
                                                    : "Iniciar Atendimento"}
                                            </Button>
                                        )}
                                    </div>

                                    {/* Componente de Transcrição */}
                                    {showTranscription && (
                                        <div className="mb-6">
                                            <TranscriptionRecorder
                                                consultationId={id!}
                                                onClose={() => setShowTranscription(false)}
                                            />
                                        </div>
                                    )}

                                    {/* Checklist com IA */}
                                    <ChecklistWithAI
                                        checklist={consultation.checklist}
                                        onToggle={handleChecklistToggle}
                                        isPending={toggleMutation.isPending}
                                    />
                                </div>
                            )}

                            {/* Procedimentos e Valores */}
                            {consultation.procedures && consultation.procedures.length > 0 && (
                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle>Procedimentos Realizados</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {consultation.procedures.map((proc) => (
                                                <div
                                                    key={proc.id}
                                                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium">{proc.name}</p>
                                                        {proc.code && (
                                                            <p className="text-xs text-muted-foreground">
                                                                Código: {proc.code}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-semibold text-primary">
                                                        {proc.value != null ? formatCurrency(proc.value) : "—"}
                                                    </p>
                                                </div>
                                            ))}
                                            <Separator className="my-4" />
                                            <div className="flex justify-between items-center pt-2">
                                                <p className="font-semibold">Total</p>
                                                <p className="text-lg font-bold text-primary">
                                                    {formatCurrency(totalProceduresValue)}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Anexos */}
                            {consultation.attachments && consultation.attachments.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Anexos</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {consultation.attachments.map((file) => (
                                                <div
                                                    key={file.id}
                                                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                                                            <FileText className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">{file.fileName}</p>
                                                            {file.fileSize && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    {file.fileSize}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ConsultationDetails;