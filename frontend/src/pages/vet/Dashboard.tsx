import { useState } from "react";
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
} from "lucide-react";

const VetDashboard = () => {
    const navigate = useNavigate();
    const [user] = useState({
        name: "Dr. Carlos Silva",
        role: "Veterinário",
        hospital: "Hospital Veterinário São Paulo",
    });

    const stats = [
        {
            title: "Consultas Hoje",
            value: "5",
            subtitle: "+2 em relação a ontem",
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Aderência Média",
            value: "91%",
            subtitle: "Aos protocolos clínicos",
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Itens Pendentes",
            value: "2",
            subtitle: "Prontuários para revisar",
            icon: AlertCircle,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
    ];

    const recentConsultations = [
        {
            id: 1,
            petName: "Thor",
            petBreed: "Cão - Golden Retriever",
            owner: "João Silva",
            type: "Rotina",
            adherence: 95,
            status: "completed",
            date: "01/02/2026 às 14:30",
        },
        {
            id: 2,
            petName: "Luna",
            petBreed: "Gato - Persa",
            owner: "Maria Santos",
            type: "Vacinação",
            adherence: 100,
            status: "completed",
            date: "01/02/2026 às 11:00",
        },
        {
            id: 3,
            petName: "Bob",
            petBreed: "Cão - Bulldog Francês",
            owner: "Pedro Costa",
            type: "Emergência",
            adherence: 78,
            status: "pending",
            date: "31/01/2026 às 16:45",
        },
    ];

    return (
        <div className="min-h-screen bg-muted/30">
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
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Olá, Dr.!
                        </h1>
                        <p className="text-muted-foreground">{user.hospital}</p>
                    </div>

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
                                {recentConsultations.map((consultation) => (
                                    <div
                                        key={consultation.id}
                                        className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/vet/consultation/${consultation.id}`)}
                                    >
                                        <div className="flex-shrink-0">
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center ${consultation.status === "completed"
                                                        ? "bg-green-100"
                                                        : "bg-orange-100"
                                                    }`}
                                            >
                                                {consultation.status === "completed" ? (
                                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                                ) : (
                                                    <AlertCircle className="h-6 w-6 text-orange-600" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-foreground">
                                                    {consultation.petName}
                                                </h4>
                                                <span className="text-sm text-muted-foreground">
                                                    ({consultation.petBreed})
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Tutor: {consultation.owner}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                                                {consultation.type}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                {consultation.date}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div
                                                className={`text-2xl font-bold ${consultation.adherence >= 90
                                                        ? "text-green-600"
                                                        : consultation.adherence >= 70
                                                            ? "text-orange-600"
                                                            : "text-red-600"
                                                    }`}
                                            >
                                                {consultation.adherence}%
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                aderência
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

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