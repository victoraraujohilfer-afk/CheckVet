import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VetSidebar from "@/components/layout/VetSidebar";
import {
    Calendar,
    Clock,
    Plus,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useConsultations } from "@/hooks/useApiHooks";
import { consultationTypeLabels, consultationStatusLabels } from "@/utils/enum-labels";
import { formatDateTime, getInitials } from "@/utils/format";
import { ConsultationStatus } from "@/types/api";

const VetDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data, isLoading } = useConsultations({
        veterinarianId: user?.id,
        limit: 5,
    });

    const consultations = data?.consultations ?? [];

    const stats = useMemo(() => {
        const today = new Date().toDateString();
        const todaysConsultations = consultations.filter(
            (c) => new Date(c.date).toDateString() === today
        );

        const adherenceValues = consultations
            .map((c) => c.adherencePercentage)
            .filter((v): v is number => v != null);
        const avgAdherence =
            adherenceValues.length > 0
                ? Math.round(adherenceValues.reduce((a, b) => a + b, 0) / adherenceValues.length)
                : 0;

        const pendingCount = consultations.filter(
            (c) => c.status === ConsultationStatus.PENDING || c.status === ConsultationStatus.IN_PROGRESS
        ).length;

        return [
            {
                title: "Consultas Hoje",
                value: String(todaysConsultations.length),
                subtitle: "Realizadas no dia",
                icon: Calendar,
                color: "text-blue-600",
                bgColor: "bg-blue-50",
            },
            {
                title: "Aderência Média",
                value: `${avgAdherence}%`,
                subtitle: "Aos protocolos clínicos",
                icon: TrendingUp,
                color: "text-green-600",
                bgColor: "bg-green-50",
            },
            {
                title: "Itens Pendentes",
                value: String(pendingCount),
                subtitle: "Prontuários para revisar",
                icon: AlertCircle,
                color: "text-orange-600",
                bgColor: "bg-orange-50",
            },
        ];
    }, [consultations]);

    const isCompleted = (status: string) =>
        status === ConsultationStatus.COMPLETED;

    return (
        <div className="min-h-screen bg-muted/30">
            <VetSidebar
                userName={user?.fullName ?? ""}
                userRole="Veterinário"
                userInitials={getInitials(user?.fullName ?? "")}
            />

            {/* Main Content */}
            <main className="ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Olá, Dr. {user?.fullName}!
                        </h1>
                        <p className="text-muted-foreground">{user?.clinicName ?? ""}</p>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {stats.map((stat, index) => (
                                    <Card key={index} className="border-2">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-sm font-medium text-muted-foreground">
                                                    {stat.title}
                                                </h3>
                                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-3xl font-bold text-foreground mb-1">
                                                    {stat.value}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {stat.subtitle}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Recent Consultations */}
                            <Card className="border-2">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Consultas Recentes</CardTitle>
                                            <CardDescription>
                                                Suas últimas consultas realizadas
                                            </CardDescription>
                                        </div>
                                        <Button onClick={() => navigate("/vet/history")} variant="outline">
                                            Ver todas
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {consultations.map((consultation) => (
                                            <div
                                                key={consultation.id}
                                                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                                                onClick={() => navigate(`/vet/consultation/${consultation.id}`)}
                                            >
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompleted(consultation.status)
                                                                ? "bg-green-100"
                                                                : "bg-orange-100"
                                                            }`}
                                                    >
                                                        {isCompleted(consultation.status) ? (
                                                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                                                        ) : (
                                                            <AlertCircle className="h-6 w-6 text-orange-600" />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-semibold text-foreground">
                                                            {consultation.patient?.name ?? "—"}
                                                        </h4>
                                                        <span className="text-sm text-muted-foreground">
                                                            ({consultation.patient?.breed ?? "—"})
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Tutor: {consultation.owner?.fullName ?? "—"}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                                                        {consultationTypeLabels[consultation.type]}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="h-4 w-4" />
                                                        {formatDateTime(consultation.date)}
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div
                                                        className={`text-2xl font-bold ${(consultation.adherencePercentage ?? 0) >= 90
                                                                ? "text-green-600"
                                                                : (consultation.adherencePercentage ?? 0) >= 70
                                                                    ? "text-orange-600"
                                                                    : "text-red-600"
                                                            }`}
                                                    >
                                                        {consultation.adherencePercentage ?? 0}%
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        aderência
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        {consultations.length === 0 && (
                                            <p className="text-center text-muted-foreground py-8">
                                                Nenhuma consulta encontrada
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Quick Actions */}
                    <div className="mt-8">
                        <Button
                            size="lg"
                            className="w-full md:w-auto"
                            onClick={() => navigate("/vet/consultation/new")}
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Iniciar Nova Consulta
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VetDashboard;
