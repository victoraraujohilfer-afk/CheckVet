import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    TrendingUp,
    ClipboardCheck,
    AlertTriangle,
    UserPlus,
    Loader2,
} from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardAnalytics, useVetRanking } from "@/hooks/useApiHooks";
import { UserStatus } from "@/types/api";
import { roleLabels, userStatusLabels } from "@/utils/enum-labels";
import { formatDateTime, getInitials } from "@/utils/format";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: dashboard, isLoading: isDashboardLoading } = useDashboardAnalytics();
    const { data: vetRanking, isLoading: isRankingLoading } = useVetRanking(5);

    const isLoading = isDashboardLoading || isRankingLoading;

    const stats = dashboard
        ? [
              {
                  title: "Veterinarios Ativos",
                  value: String(dashboard.activeVeterinarians),
                  subtitle: `${dashboard.totalVeterinarians} total cadastrados`,
                  icon: Users,
                  color: "text-blue-600",
                  bgColor: "bg-blue-50",
              },
              {
                  title: "Aderencia Geral",
                  value: `${dashboard.averageAdherence}%`,
                  subtitle: "Media de aderencia aos protocolos",
                  icon: TrendingUp,
                  color: "text-green-600",
                  bgColor: "bg-green-50",
              },
              {
                  title: "Consultas Hoje",
                  value: String(dashboard.consultationsToday),
                  subtitle: `${dashboard.totalConsultations} total realizadas`,
                  icon: ClipboardCheck,
                  color: "text-purple-600",
                  bgColor: "bg-purple-50",
              },
              {
                  title: "Alertas Pendentes",
                  value: String(dashboard.pendingAlerts),
                  subtitle: "Requerem atencao",
                  icon: AlertTriangle,
                  color: "text-orange-600",
                  bgColor: "bg-orange-50",
              },
          ]
        : [];

    const getStatusBadge = (status: UserStatus) => {
        switch (status) {
            case UserStatus.ACTIVE:
                return <Badge variant="default">{userStatusLabels[status]}</Badge>;
            case UserStatus.WARNING:
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{userStatusLabels[status]}</Badge>;
            case UserStatus.INACTIVE:
                return <Badge variant="destructive">{userStatusLabels[status]}</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Sidebar */}
            <AdminSidebar
                userName={user?.fullName}
                userRole={user?.role ? roleLabels[user.role] : undefined}
                userInitials={user?.fullName ? getInitials(user.fullName) : "??"}
            />

            {/* Main Content */}
            <main className="ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                Painel Administrativo
                            </h1>
                            <p className="text-muted-foreground">{user?.clinicName ?? ""}</p>
                        </div>
                        <Button onClick={() => navigate("/admin/veterinarians/new")}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Cadastrar Veterinario
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

                            {/* Veterinarians Performance */}
                            <Card className="border-2">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Desempenho dos Veterinarios</CardTitle>
                                            <CardDescription>
                                                Acompanhamento de aderencia aos protocolos clinicos
                                            </CardDescription>
                                        </div>
                                        <Button variant="outline" onClick={() => navigate("/admin/veterinarians")}>
                                            Ver todos
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {vetRanking && vetRanking.length > 0 ? (
                                            vetRanking.map((vet) => (
                                                <div
                                                    key={vet.id}
                                                    className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                                                    onClick={() => navigate(`/admin/veterinarians/${vet.id}`)}
                                                >
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                            {getInitials(vet.fullName)}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-semibold text-foreground">
                                                                {vet.fullName}
                                                            </h4>
                                                            <span className="text-sm text-muted-foreground">
                                                                CRMV: {vet.crmv ?? "N/A"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <span>{vet.totalConsultations} consultas</span>
                                                            <span>-</span>
                                                            <span>
                                                                Ultima:{" "}
                                                                {vet.lastConsultation
                                                                    ? formatDateTime(vet.lastConsultation)
                                                                    : "Nenhuma"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <div
                                                                className={`text-2xl font-bold ${
                                                                    vet.averageAdherence >= 90
                                                                        ? "text-green-600"
                                                                        : vet.averageAdherence >= 80
                                                                            ? "text-orange-600"
                                                                            : "text-red-600"
                                                                }`}
                                                            >
                                                                {vet.averageAdherence}%
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">
                                                                aderencia
                                                            </p>
                                                        </div>

                                                        {getStatusBadge(vet.status)}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-muted-foreground py-8">
                                                Nenhum veterinario encontrado
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
