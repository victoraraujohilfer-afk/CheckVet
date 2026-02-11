import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    Search,
    Filter,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Clock,
    Download,
    Eye,
    Loader2,
} from "lucide-react";
import VetSidebar from "@/components/layout/VetSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useConsultations } from "@/hooks/useApiHooks";
import {
    consultationTypeLabels,
    consultationStatusLabels,
} from "@/utils/enum-labels";
import { formatDate, formatTime, getInitials } from "@/utils/format";
import { ConsultationType, ConsultationStatus } from "@/types/api";

const VetHistory = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    const { data, isLoading } = useConsultations({
        veterinarianId: user?.id,
        search: searchTerm || undefined,
        type: filterType !== "all" ? filterType : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
    });

    const consultations = data?.consultations ?? [];

    const isCompleted = (status: string) =>
        status === ConsultationStatus.COMPLETED;

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Sidebar */}
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
                        <div className="flex items-center gap-3 mb-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/vet/dashboard")}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">
                                    Histórico de Consultas
                                </h1>
                                <p className="text-muted-foreground">
                                    Todas as suas consultas realizadas
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Buscar por pet ou tutor..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                <Select value={filterType} onValueChange={setFilterType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tipo de consulta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os tipos</SelectItem>
                                        {Object.values(ConsultationType).map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {consultationTypeLabels[type]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os status</SelectItem>
                                        {Object.values(ConsultationStatus).map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {consultationStatusLabels[status]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Results Summary */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                                {data?.total ?? consultations.length}
                            </span>{" "}
                            consulta{(data?.total ?? consultations.length) !== 1 ? "s" : ""} encontrada
                            {(data?.total ?? consultations.length) !== 1 ? "s" : ""}
                        </p>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Exportar Relatório
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <>
                            {/* Consultations List */}
                            <div className="space-y-4">
                                {consultations.map((consultation) => (
                                    <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-6">
                                                {/* Status Icon */}
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className={`w-14 h-14 rounded-full flex items-center justify-center ${isCompleted(consultation.status)
                                                            ? "bg-green-100"
                                                            : "bg-orange-100"
                                                            }`}
                                                    >
                                                        {isCompleted(consultation.status) ? (
                                                            <CheckCircle2 className="h-7 w-7 text-green-600" />
                                                        ) : (
                                                            <AlertCircle className="h-7 w-7 text-orange-600" />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Main Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-foreground mb-1">
                                                                {consultation.patient?.name ?? "—"}{" "}
                                                                <span className="text-sm font-normal text-muted-foreground">
                                                                    ({consultation.patient?.breed ?? "—"})
                                                                </span>
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                Tutor: {consultation.owner?.fullName ?? "—"}
                                                            </p>
                                                        </div>

                                                        <Badge
                                                            variant={
                                                                isCompleted(consultation.status)
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {consultationStatusLabels[consultation.status]}
                                                        </Badge>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                        <div>
                                                            <p className="text-xs text-muted-foreground mb-1">
                                                                Tipo
                                                            </p>
                                                            <p className="text-sm font-medium">
                                                                {consultationTypeLabels[consultation.type]}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-muted-foreground mb-1">
                                                                Protocolo
                                                            </p>
                                                            <p className="text-sm font-medium">
                                                                {consultation.protocol?.name ?? "—"}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-muted-foreground mb-1">
                                                                Data/Hora
                                                            </p>
                                                            <p className="text-sm font-medium flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {formatDate(consultation.date)} às {formatTime(consultation.date)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-muted-foreground mb-1">
                                                                Aderência
                                                            </p>
                                                            <p
                                                                className={`text-sm font-bold ${(consultation.adherencePercentage ?? 0) >= 90
                                                                    ? "text-green-600"
                                                                    : (consultation.adherencePercentage ?? 0) >= 70
                                                                        ? "text-orange-600"
                                                                        : "text-red-600"
                                                                    }`}
                                                            >
                                                                {consultation.adherencePercentage ?? 0}%
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                navigate(`/vet/consultation/${consultation.id}`)
                                                            }
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Ver Detalhes
                                                        </Button>
                                                        <Button size="sm" variant="ghost">
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Baixar Prontuário
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {consultations.length === 0 && (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                            <Search className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Nenhuma consulta encontrada
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Tente ajustar os filtros ou termo de busca
                                        </p>
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

export default VetHistory;
