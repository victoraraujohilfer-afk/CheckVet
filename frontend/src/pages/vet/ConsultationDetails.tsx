import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    Home,
    LogOut,
    Plus,
    History,
} from "lucide-react";
import VetSidebar from "@/components/layout/VetSidebar";

const ConsultationDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user] = useState({
        name: "Dr. Carlos Silva",
        role: "Veterinário",
    });

    // Mock data - em produção virá do backend
    const consultation = {
        id: parseInt(id || "1"),
        petName: "Thor",
        petBreed: "Cão - Golden Retriever",
        petAge: "3 anos",
        petWeight: "32 kg",
        owner: "João Silva",
        ownerPhone: "(11) 98765-4321",
        ownerEmail: "joao.silva@email.com",
        type: "Rotina",
        date: "01/02/2026",
        time: "14:30",
        protocol: "Exame Clínico Geral",
        adherence: 95,
        status: "completed",
        veterinarian: "Dr. Carlos Silva",
        crmv: "SP-12345",

        // SOAP
        soap: {
            subjective: "Tutor relata que o animal está ativo e com apetite normal. Sem queixas específicas. Veio para consulta de rotina e atualização de vacinas.",
            objective: {
                temperature: "38.5°C",
                heartRate: "90 bpm",
                respiratoryRate: "24 mpm",
                mucosas: "Róseas e úmidas",
                hydration: "Adequada (TPC < 2s)",
                bodyCondition: "Escore 5/9 (peso ideal)",
                generalExam: "Animal alerta, responsivo, sem alterações evidentes à inspeção geral.",
            },
            assessment: "Animal hígido, sem alterações clínicas significativas. Condição corporal adequada. Todos os parâmetros vitais dentro da normalidade para a espécie e idade.",
            plan: "1. Aplicação de vacina polivalente (V10)\n2. Aplicação de vacina antirrábica\n3. Vermifugação com Drontal Plus\n4. Orientações sobre alimentação e exercícios\n5. Retorno em 1 ano para nova avaliação de rotina",
        },

        // Checklist do protocolo
        checklist: [
            { item: "Anamnese completa", completed: true, timestamp: "14:30" },
            { item: "Aferição de temperatura", completed: true, timestamp: "14:32" },
            { item: "Auscultação cardíaca", completed: true, timestamp: "14:33" },
            { item: "Auscultação pulmonar", completed: true, timestamp: "14:34" },
            { item: "Palpação abdominal", completed: true, timestamp: "14:35" },
            { item: "Avaliação de mucosas", completed: true, timestamp: "14:36" },
            { item: "Teste de hidratação (TPC)", completed: true, timestamp: "14:37" },
            { item: "Escore de condição corporal", completed: true, timestamp: "14:38" },
            { item: "Vacinação polivalente", completed: true, timestamp: "14:40" },
            { item: "Vacinação antirrábica", completed: true, timestamp: "14:41" },
            { item: "Vermifugação", completed: true, timestamp: "14:42" },
            { item: "Orientações ao tutor", completed: true, timestamp: "14:45" },
            { item: "Agendamento de retorno", completed: true, timestamp: "14:46" },
            { item: "Registro em prontuário", completed: true, timestamp: "14:48" },
            { item: "Assinatura do termo de consentimento", completed: false, timestamp: null },
        ],

        procedures: [
            { name: "Vacina V10", code: "VAC-001", value: "R$ 80,00" },
            { name: "Vacina Antirrábica", code: "VAC-002", value: "R$ 60,00" },
            { name: "Vermifugação (Drontal Plus)", code: "MED-015", value: "R$ 45,00" },
            { name: "Consulta Clínica", code: "CONS-001", value: "R$ 150,00" },
        ],

        attachments: [
            { name: "Termo_Vacinacao_Thor.pdf", size: "245 KB", type: "application/pdf" },
            { name: "Carteira_Vacinacao.pdf", size: "180 KB", type: "application/pdf" },
        ],
    };

    const completedItems = consultation.checklist.filter(item => item.completed).length;
    const totalItems = consultation.checklist.length;
    const adherencePercentage = Math.round((completedItems / totalItems) * 100);

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Sidebar */}
            <VetSidebar
                userName={user.name}
                userRole={user.role}
                userInitials="CS"
            />

            {/* Main Content */}
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

                    {/* Status Card */}
                    <Card className="mb-6 border-2">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center ${consultation.status === "completed"
                                                ? "bg-green-100"
                                                : "bg-orange-100"
                                            }`}
                                    >
                                        {consultation.status === "completed" ? (
                                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                                        ) : (
                                            <AlertCircle className="h-8 w-8 text-orange-600" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground mb-1">
                                            {consultation.petName}
                                        </h2>
                                        <p className="text-muted-foreground">
                                            {consultation.petBreed} • {consultation.petAge} • {consultation.petWeight}
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
                                        <Badge variant="default">{consultation.type}</Badge>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Protocolo</p>
                                        <p className="text-sm font-medium">{consultation.protocol}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            Data
                                        </p>
                                        <p className="text-sm font-medium">{consultation.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            Horário
                                        </p>
                                        <p className="text-sm font-medium">{consultation.time}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                            <Stethoscope className="h-3 w-3" />
                                            Veterinário
                                        </p>
                                        <p className="text-sm font-medium">{consultation.veterinarian}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">CRMV</p>
                                        <p className="text-sm font-medium">{consultation.crmv}</p>
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
                                    <p className="text-sm font-medium">{consultation.owner}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Telefone</p>
                                    <p className="text-sm font-medium">{consultation.ownerPhone}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                                    <p className="text-sm font-medium text-primary">
                                        {consultation.ownerEmail}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* SOAP */}
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
                                    {consultation.soap.subjective}
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
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pl-8">
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">Temperatura</p>
                                        <p className="text-sm font-medium">{consultation.soap.objective.temperature}</p>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">FC</p>
                                        <p className="text-sm font-medium">{consultation.soap.objective.heartRate}</p>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">FR</p>
                                        <p className="text-sm font-medium">{consultation.soap.objective.respiratoryRate}</p>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">Mucosas</p>
                                        <p className="text-sm font-medium">{consultation.soap.objective.mucosas}</p>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">Hidratação</p>
                                        <p className="text-sm font-medium">{consultation.soap.objective.hydration}</p>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">Condição Corporal</p>
                                        <p className="text-sm font-medium">{consultation.soap.objective.bodyCondition}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-3 pl-8">
                                    {consultation.soap.objective.generalExam}
                                </p>
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
                                    {consultation.soap.assessment}
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
                                    {consultation.soap.plan}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Checklist do Protocolo */}
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
                                {consultation.checklist.map((item, index) => (
                                    <div
                                        key={index}
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
                                                className={`text-sm font-medium ${item.completed ? "text-green-900" : "text-orange-900"
                                                    }`}
                                            >
                                                {item.item}
                                            </span>
                                        </div>
                                        {item.timestamp && (
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {item.timestamp}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Procedimentos e Valores */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Procedimentos Realizados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {consultation.procedures.map((proc, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">{proc.name}</p>
                                            <p className="text-xs text-muted-foreground">Código: {proc.code}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-primary">{proc.value}</p>
                                    </div>
                                ))}
                                <Separator className="my-4" />
                                <div className="flex justify-between items-center pt-2">
                                    <p className="font-semibold">Total</p>
                                    <p className="text-lg font-bold text-primary">R$ 335,00</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Anexos */}
                    {consultation.attachments.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Anexos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {consultation.attachments.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{file.name}</p>
                                                    <p className="text-xs text-muted-foreground">{file.size}</p>
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
                </div>
            </main>
        </div>
    );
};

export default ConsultationDetails;