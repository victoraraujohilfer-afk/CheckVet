import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    TrendingUp,
    TrendingDown,
    Download,
    Calendar,
    Award,
    AlertTriangle,
    Loader2,
} from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardAnalytics, useVetRanking, useProtocolAdherence } from "@/hooks/useApiHooks";
import { roleLabels, protocolTypeLabels } from "@/utils/enum-labels";
import { getInitials } from "@/utils/format";

const Analytics = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [period, setPeriod] = useState("month");

    const { data: dashboard, isLoading: isDashboardLoading } = useDashboardAnalytics();
    const { data: vetRanking, isLoading: isRankingLoading } = useVetRanking();
    const { data: protocolAdherence, isLoading: isProtocolLoading } = useProtocolAdherence();

    const isLoading = isDashboardLoading || isRankingLoading || isProtocolLoading;

    return (
        <div className="min-h-screen bg-muted/30">
            <AdminSidebar
                userName={user?.fullName}
                userRole={user?.role ? roleLabels[user.role] : undefined}
                userInitials={user?.fullName ? getInitials(user.fullName) : "??"}
            />

            <main className="ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                Relatórios e Analytics
                            </h1>
                            <p className="text-muted-foreground">
                                Métricas de desempenho e aderência aos protocolos
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger className="w-40">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="week">Esta Semana</SelectItem>
                                    <SelectItem value="month">Este Mês</SelectItem>
                                    <SelectItem value="quarter">Trimestre</SelectItem>
                                    <SelectItem value="year">Ano</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button>
                                <Download className="h-4 w-4 mr-2" />
                                Exportar
                            </Button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <>
                            {/* KPIs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <Card className="border-2">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                Total de Consultas
                                            </h3>
                                            <TrendingUp className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-foreground mb-1">
                                                {(dashboard?.totalConsultations ?? 0).toLocaleString()}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {dashboard?.consultationsToday ?? 0} hoje
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-2">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                Aderência Média
                                            </h3>
                                            <TrendingUp className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-foreground mb-1">
                                                {dashboard?.averageAdherence ?? 0}%
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Média geral dos protocolos
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-2">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                Veterinários Ativos
                                            </h3>
                                            <TrendingUp className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-foreground mb-1">
                                                {dashboard?.activeVeterinarians ?? 0}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {dashboard?.totalVeterinarians ?? 0} total cadastrados
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-2">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                Alertas Pendentes
                                            </h3>
                                            <TrendingDown className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-foreground mb-1">
                                                {dashboard?.pendingAlerts ?? 0}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Requerem atenção
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                {/* Top Veterinarians */}
                                <Card className="border-2">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Award className="h-5 w-5" />
                                            Ranking de Desempenho
                                        </CardTitle>
                                        <CardDescription>
                                            Veterinários com maior aderência aos protocolos
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {vetRanking && vetRanking.length > 0 ? (
                                                vetRanking.map((vet, index) => (
                                                    <div
                                                        key={vet.id}
                                                        className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                                    >
                                                        <div className="flex-shrink-0">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                                                                index === 0 ? "bg-yellow-500" :
                                                                index === 1 ? "bg-gray-400" :
                                                                index === 2 ? "bg-orange-600" : "bg-primary"
                                                            }`}>
                                                                {index + 1}
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-foreground">{vet.fullName}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {vet.totalConsultations} consultas
                                                            </p>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className={`text-xl font-bold ${
                                                                vet.averageAdherence >= 90
                                                                    ? "text-green-600"
                                                                    : vet.averageAdherence >= 80
                                                                        ? "text-orange-600"
                                                                        : "text-red-600"
                                                            }`}>
                                                                {vet.averageAdherence}%
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center text-muted-foreground py-8">
                                                    Nenhum dado disponível
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Protocol Breakdown */}
                                <Card className="border-2">
                                    <CardHeader>
                                        <CardTitle>Aderência por Protocolo</CardTitle>
                                        <CardDescription>
                                            Performance em cada tipo de protocolo clínico
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {protocolAdherence && protocolAdherence.length > 0 ? (
                                                protocolAdherence.map((protocol) => (
                                                    <div key={protocol.id}>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <div>
                                                                <p className="text-sm font-medium">{protocol.name}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {protocol.totalConsultations} consultas
                                                                </p>
                                                            </div>
                                                            <p className={`text-lg font-bold ${
                                                                protocol.averageAdherence >= 90 ? "text-green-600" :
                                                                protocol.averageAdherence >= 80 ? "text-orange-600" : "text-red-600"
                                                            }`}>
                                                                {protocol.averageAdherence}%
                                                            </p>
                                                        </div>
                                                        <div className="w-full bg-muted rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${
                                                                    protocol.averageAdherence >= 90 ? "bg-green-600" :
                                                                    protocol.averageAdherence >= 80 ? "bg-orange-600" : "bg-red-600"
                                                                }`}
                                                                style={{ width: `${protocol.averageAdherence}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center text-muted-foreground py-8">
                                                    Nenhum dado disponível
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Analytics;
