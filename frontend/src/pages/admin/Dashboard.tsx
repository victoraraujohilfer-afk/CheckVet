import { useState } from "react";
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
    LogOut,
    Home,
    UserPlus,
    BarChart3,
    Settings,
} from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user] = useState({
        name: "Dr. Roberto Mendes",
        role: "Administrador",
        hospital: "Hospital Veterinário São Paulo",
    });

    const stats = [
        {
            title: "Veterinários Ativos",
            value: "12",
            subtitle: "+2 este mês",
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Aderência Geral",
            value: "87%",
            subtitle: "+5% vs mês anterior",
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Consultas Hoje",
            value: "48",
            subtitle: "Média de 4 por veterinário",
            icon: ClipboardCheck,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Alertas Pendentes",
            value: "3",
            subtitle: "Requerem atenção",
            icon: AlertTriangle,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
    ];

    const veterinarians = [
        {
            id: 1,
            name: "Dr. Carlos Silva",
            crmv: "SP-12345",
            consultations: 156,
            adherence: 92,
            status: "active",
            lastConsultation: "Hoje às 15:30",
        },
        {
            id: 2,
            name: "Dra. Ana Costa",
            crmv: "SP-23456",
            consultations: 142,
            adherence: 95,
            status: "active",
            lastConsultation: "Hoje às 14:45",
        },
        {
            id: 3,
            name: "Dr. Pedro Oliveira",
            crmv: "SP-34567",
            consultations: 128,
            adherence: 88,
            status: "active",
            lastConsultation: "Hoje às 13:20",
        },
        {
            id: 4,
            name: "Dra. Mariana Santos",
            crmv: "SP-45678",
            consultations: 134,
            adherence: 78,
            status: "warning",
            lastConsultation: "Ontem às 18:00",
        },
        {
            id: 5,
            name: "Dr. Lucas Ferreira",
            crmv: "SP-56789",
            consultations: 98,
            adherence: 85,
            status: "active",
            lastConsultation: "Hoje às 12:15",
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
                                Painel Administrativo
                            </h1>
                            <p className="text-muted-foreground">{user.hospital}</p>
                        </div>
                        <Button onClick={() => navigate("/admin/veterinarians/new")}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Cadastrar Veterinário
                        </Button>
                    </div>

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
                                    <CardTitle>Desempenho dos Veterinários</CardTitle>
                                    <CardDescription>
                                        Acompanhamento de aderência aos protocolos clínicos
                                    </CardDescription>
                                </div>
                                <Button variant="outline" onClick={() => navigate("/admin/veterinarians")}>
                                    Ver todos
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {veterinarians.map((vet) => (
                                    <div
                                        key={vet.id}
                                        className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/admin/veterinarians/${vet.id}`)}
                                    >
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                {vet.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-foreground">
                                                    {vet.name}
                                                </h4>
                                                <span className="text-sm text-muted-foreground">
                                                    CRMV: {vet.crmv}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span>{vet.consultations} consultas</span>
                                                <span>•</span>
                                                <span>Última: {vet.lastConsultation}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div
                                                    className={`text-2xl font-bold ${vet.adherence >= 90
                                                        ? "text-green-600"
                                                        : vet.adherence >= 80
                                                            ? "text-orange-600"
                                                            : "text-red-600"
                                                        }`}
                                                >
                                                    {vet.adherence}%
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    aderência
                                                </p>
                                            </div>

                                            <Badge
                                                variant={
                                                    vet.status === "active" ? "default" : "destructive"
                                                }
                                            >
                                                {vet.status === "active" ? "Ativo" : "Atenção"}
                                            </Badge>
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

export default AdminDashboard;