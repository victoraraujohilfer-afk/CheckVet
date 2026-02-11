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
} from "lucide-react";
import VetSidebar from "@/components/layout/VetSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useConsultation } from "@/hooks/useApiHooks";
import { consultationTypeLabels, consultationStatusLabels } from "@/utils/enum-labels";
import { formatDate, formatTime, formatDateTime, formatCurrency, getInitials } from "@/utils/format";
import { ConsultationStatus } from "@/types/api";

const ConsultationDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();

    const { data: consultation, isLoading } = useConsultation(id ?? "");

    const completedItems = consultation?.checklist?.filter(item => item.completed).length ?? 0;
    const totalItems = consultation?.checklist?.length ?? 0;
    const adherencePercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : (consultation?.adherencePercentage ?? 0);

    const isCompleted = consultation?.status === ConsultationStatus.COMPLETED;

    const totalProceduresValue = consultation?.procedures?.reduce((sum, p) => sum + (p.value ?? 0), 0) ?? 0;

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
                                <Button>
                                    <Download className="h-4 w-4 mr-2" />
                                    Baixar PDF
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
                                                className={`w-16 h-16 rounded-full flex items-center justify-center ${isCompleted ? "bg-green-100" : "bg-orange-100"}`}
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
                                                    {consultation.patient?.breed ?? "—"} • {consultation.patient?.age ?? "—"} • {consultation.patient?.weight ? `${consultation.patient.weight} kg` : "—"}
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

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                {/* Informações Gerais */}
                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            Informações da Consulta
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Tipo</p>
                                                <Badge variant="default">{consultationTypeLabels[consultation.type]}</Badge>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Protocolo</p>
                                                <p className="text-sm font-medium">{consultation.protocol?.name ?? "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Data
                                                </p>
                                                <p className="text-sm font-medium">{formatDate(consultation.date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Horário
                                                </p>
                                                <p className="text-sm font-medium">{formatTime(consultation.date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                                    <Stethoscope className="h-3 w-3" />
                                                    Veterinário
                                                </p>
                                                <p className="text-sm font-medium">{consultation.veterinarian?.fullName ?? "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">CRMV</p>
                                                <p className="text-sm font-medium">{consultation.veterinarian?.crmv ?? "—"}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Informações do Tutor */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            Tutor
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Nome</p>
                                            <p className="text-sm font-medium">{consultation.owner?.fullName ?? "—"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Telefone</p>
                                            <p className="text-sm font-medium">{consultation.owner?.phone ?? "—"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Email</p>
                                            <p className="text-sm font-medium text-primary">
                                                {consultation.owner?.email ?? "—"}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* SOAP */}
                            {consultation.soapNote && (
                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Activity className="h-5 w-5" />
                                            Prontuário SOAP
                                        </CardTitle>
                                        <CardDescription>
                                            Subjetivo, Objetivo, Avaliação e Plano
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Subjetivo */}
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">
                                                    S
                                                </span>
                                                Subjetivo
                                            </h3>
                                            <p className="text-sm text-muted-foreground pl-8">
                                                {consultation.soapNote.subjective ?? "Não registrado"}
                                            </p>
                                        </div>

                                        <Separator />

                                        {/* Objetivo */}
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs flex items-center justify-center font-bold">
                                                    O
                                                </span>
                                                Objetivo
                                            </h3>
                                            {consultation.soapNote.objectiveData && Object.keys(consultation.soapNote.objectiveData).length > 0 ? (
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pl-8">
                                                    {Object.entries(consultation.soapNote.objectiveData).map(([key, value]) => (
                                                        <div key={key} className="p-3 bg-muted/50 rounded-lg">
                                                            <p className="text-xs text-muted-foreground mb-1">{key}</p>
                                                            <p className="text-sm font-medium">{value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground pl-8">Não registrado</p>
                                            )}
                                        </div>

                                        <Separator />

                                        {/* Avaliação */}
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center font-bold">
                                                    A
                                                </span>
                                                Avaliação
                                            </h3>
                                            <p className="text-sm text-muted-foreground pl-8">
                                                {consultation.soapNote.assessment ?? "Não registrado"}
                                            </p>
                                        </div>

                                        <Separator />

                                        {/* Plano */}
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs flex items-center justify-center font-bold">
                                                    P
                                                </span>
                                                Plano
                                            </h3>
                                            <div className="text-sm text-muted-foreground pl-8 whitespace-pre-line">
                                                {consultation.soapNote.plan ?? "Não registrado"}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Checklist do Protocolo */}
                            {consultation.checklist && consultation.checklist.length > 0 && (
                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <ClipboardList className="h-5 w-5" />
                                            Checklist do Protocolo
                                        </CardTitle>
                                        <CardDescription>
                                            {completedItems} de {totalItems} itens concluídos ({adherencePercentage}%)
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {consultation.checklist.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className={`flex items-center justify-between p-3 rounded-lg border ${item.completed
                                                        ? "bg-green-50 border-green-200"
                                                        : "bg-orange-50 border-orange-200"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {item.completed ? (
                                                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                                        ) : (
                                                            <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                                                        )}
                                                        <span
                                                            className={`text-sm font-medium ${item.completed ? "text-green-900" : "text-orange-900"}`}
                                                        >
                                                            {item.protocolItem?.name ?? "Item"}
                                                        </span>
                                                    </div>
                                                    {item.completedAt && (
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {formatTime(item.completedAt)}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
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
                                                            <p className="text-xs text-muted-foreground">Código: {proc.code}</p>
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
                                                                <p className="text-xs text-muted-foreground">{file.fileSize}</p>
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
