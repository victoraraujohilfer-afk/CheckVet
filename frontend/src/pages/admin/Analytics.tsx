import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Home,
    Users,
    BarChart3,
    Settings,
    LogOut,
    TrendingUp,
    TrendingDown,
    Download,
    Calendar,
    Award,
    AlertTriangle,
} from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";

const Analytics = () => {
    const navigate = useNavigate();
    const [user] = useState({
        name: "Dr. Roberto Mendes",
        role: "Administrador",
    });

    const [period, setPeriod] = useState("month");

    // Mock data
    const metrics = {
        totalConsultations: 1248,
        totalConsultationsChange: "+12%",
        averageAdherence: 87,
        averenceAdherenceChange: "+5%",
        protocolCompliance: 92,
        protocolComplianceChange: "+3%",
        criticalAlerts: 8,
        criticalAlertsChange: "-2",
    };

    const topVeterinarians = [
        { rank: 1, name: "Dra. Ana Costa", adherence: 95, consultations: 142, trend: "up" },
        { rank: 2, name: "Dr. Carlos Silva", adherence: 92, consultations: 156, trend: "up" },
        { rank: 3, name: "Dra. Mariana Souza", adherence: 90, consultations: 134, trend: "stable" },
        { rank: 4, name: "Dr. Pedro Oliveira", adherence: 88, consultations: 128, trend: "down" },
        { rank: 5, name: "Dr. Lucas Ferreira", adherence: 85, consultations: 98, trend: "up" },
    ];

    const protocolBreakdown = [
        { protocol: "Exame Clínico Geral", count: 487, adherence: 91 },
        { protocol: "Vacinação", count: 312, adherence: 96 },
        { protocol: "Emergência", count: 189, adherence: 78 },
        { protocol: "Pré-operatório", count: 145, adherence: 94 },
        { protocol: "Pós-cirúrgico", count: 115, adherence: 88 },
    ];

    const alerts = [
        {
            veterinarian: "Dr. Lucas Ferreira",
            protocol: "Atendimento de Emergência",
            date: "10/02/2026",
            severity: "high",
            description: "2 itens críticos não completados",
        },
        {
            veterinarian: "Dra. Mariana Santos",
            protocol: "Exame Clínico Geral",
            date: "09/02/2026",
            severity: "medium",
            description: "Tempo de consulta abaixo da média",
        },
        {
            veterinarian: "Dr. Pedro Oliveira",
            protocol: "Vacinação",
            date: "08/02/2026",
            severity: "low",
            description: "Documentação incompleta",
        },
    ];

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Sidebar */}
            <AdminSidebar
                userName={user.name}
                userRole={user.role}
                userInitials="RM"
            />

            {/* Main Content */}
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
                                        {metrics.totalConsultations.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-green-600 font-medium">
                                        {metrics.totalConsultationsChange} vs mês anterior
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
                                        {metrics.averageAdherence}%
                                    </p>
                                    <p className="text-sm text-green-600 font-medium">
                                        {metrics.averenceAdherenceChange} vs mês anterior
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Compliance de Protocolos
                                    </h3>
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-foreground mb-1">
                                        {metrics.protocolCompliance}%
                                    </p>
                                    <p className="text-sm text-green-600 font-medium">
                                        {metrics.protocolComplianceChange} vs mês anterior
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Alertas Críticos
                                    </h3>
                                    <TrendingDown className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-foreground mb-1">
                                        {metrics.criticalAlerts}
                                    </p>
                                    <p className="text-sm text-green-600 font-medium">
                                        {metrics.criticalAlertsChange} vs mês anterior
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
                                    {topVeterinarians.map((vet) => (
                                        <div
                                            key={vet.rank}
                                            className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex-shrink-0">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${vet.rank === 1 ? "bg-yellow-500" :
                                                        vet.rank === 2 ? "bg-gray-400" :
                                                            vet.rank === 3 ? "bg-orange-600" : "bg-primary"
                                                    }`}>
                                                    {vet.rank}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-foreground">{vet.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {vet.consultations} consultas
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xl font-bold text-green-600">
                                                    {vet.adherence}%
                                                </p>
                                                {vet.trend === "up" && (
                                                    <TrendingUp className="h-4 w-4 text-green-600 ml-auto" />
                                                )}
                                                {vet.trend === "down" && (
                                                    <TrendingDown className="h-4 w-4 text-red-600 ml-auto" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
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
                                    {protocolBreakdown.map((protocol, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between items-center mb-2">
                                                <div>
                                                    <p className="text-sm font-medium">{protocol.protocol}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {protocol.count} consultas
                                                    </p>
                                                </div>
                                                <p className={`text-lg font-bold ${protocol.adherence >= 90 ? "text-green-600" :
                                                        protocol.adherence >= 80 ? "text-orange-600" : "text-red-600"
                                                    }`}>
                                                    {protocol.adherence}%
                                                </p>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${protocol.adherence >= 90 ? "bg-green-600" :
                                                            protocol.adherence >= 80 ? "bg-orange-600" : "bg-red-600"
                                                        }`}
                                                    style={{ width: `${protocol.adherence}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Alerts */}
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Alertas Recentes
                            </CardTitle>
                            <CardDescription>
                                Desvios de protocolo e situações que requerem atenção
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {alerts.map((alert, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 rounded-lg border-2 border-border hover:bg-muted/50 transition-colors"
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${alert.severity === "high" ? "bg-red-100" :
                                                alert.severity === "medium" ? "bg-orange-100" : "bg-yellow-100"
                                            }`}>
                                            <AlertTriangle className={`h-5 w-5 ${alert.severity === "high" ? "text-red-600" :
                                                    alert.severity === "medium" ? "text-orange-600" : "text-yellow-600"
                                                }`} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium text-foreground">
                                                    {alert.veterinarian}
                                                </p>
                                                <Badge variant={
                                                    alert.severity === "high" ? "destructive" :
                                                        alert.severity === "medium" ? "secondary" : "outline"
                                                }>
                                                    {alert.severity === "high" ? "Alta" :
                                                        alert.severity === "medium" ? "Média" : "Baixa"}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-1">
                                                {alert.protocol}
                                            </p>
                                            <p className="text-sm font-medium text-foreground">
                                                {alert.description}
                                            </p>
                                        </div>

                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm text-muted-foreground">{alert.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default Analytics;