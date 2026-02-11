import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/layout/AdminSidebar";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    ArrowLeft,
    UserPlus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Mail,
    Phone,
    FileText,
    Shield,
    UserX,
    Users,
    BarChart3,
    Loader2,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers, useUpdateUser, useDeleteUser, useVetRanking } from "@/hooks/useApiHooks";
import { UserStatus } from "@/types/api";
import { roleLabels, userStatusLabels } from "@/utils/enum-labels";
import { formatDate, formatDateTime, getInitials } from "@/utils/format";

const AdminVeterinarians = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: usersData, isLoading: isUsersLoading } = useUsers({
        role: 'VETERINARIAN',
        search: searchTerm || undefined,
    });
    const { data: vetRankingData } = useVetRanking();
    const updateUser = useUpdateUser();
    const deleteUser = useDeleteUser();

    const veterinarians = usersData?.users ?? [];

    const rankingMap = new Map(
        (vetRankingData ?? []).map((r) => [r.id, r])
    );

    const handleDeleteVet = (vetId: string) => {
        deleteUser.mutate(vetId, {
            onSuccess: () => toast.success("Veterinario removido com sucesso!"),
            onError: (err: any) => toast.error(err?.response?.data?.message ?? "Erro ao remover veterinario"),
        });
    };

    const handleToggleStatus = (vetId: string, currentStatus: UserStatus) => {
        const newStatus = currentStatus === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
        updateUser.mutate(
            { id: vetId, data: { status: newStatus } },
            {
                onSuccess: () => toast.success("Status atualizado!"),
                onError: (err: any) => toast.error(err?.response?.data?.message ?? "Erro ao atualizar status"),
            }
        );
    };

    const activeCount = veterinarians.filter((v) => v.status === UserStatus.ACTIVE).length;
    const inactiveCount = veterinarians.filter((v) => v.status === UserStatus.INACTIVE).length;
    const avgAdherence =
        vetRankingData && vetRankingData.length > 0
            ? Math.round(vetRankingData.reduce((acc, v) => acc + v.averageAdherence, 0) / vetRankingData.length)
            : 0;

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
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => navigate("/admin/dashboard")}
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                    <h1 className="text-3xl font-bold text-foreground">
                                        Gerenciar Veterinarios
                                    </h1>
                                </div>
                                <p className="text-muted-foreground ml-12">
                                    Cadastre e gerencie os veterinarios do hospital
                                </p>
                            </div>

                            <Button onClick={() => navigate("/admin/veterinarians/new")}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Novo Veterinario
                            </Button>
                        </div>
                    </div>

                    {/* Search */}
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por nome, email ou CRMV..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-green-100">
                                        <Users className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Ativos</p>
                                        <p className="text-2xl font-bold">{activeCount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-red-100">
                                        <UserX className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Inativos</p>
                                        <p className="text-2xl font-bold">{inactiveCount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-blue-100">
                                        <BarChart3 className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Aderencia Media</p>
                                        <p className="text-2xl font-bold">{avgAdherence}%</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {isUsersLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <>
                            {/* Veterinarians List */}
                            <div className="grid gap-4">
                                {veterinarians.map((vet) => {
                                    const ranking = rankingMap.get(vet.id);
                                    const adherence = ranking?.averageAdherence ?? 0;
                                    const totalConsultations = ranking?.totalConsultations ?? (vet._count?.consultations ?? 0);

                                    return (
                                        <Card key={vet.id} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-6">
                                                    <Avatar className="h-16 w-16">
                                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                                                            {getInitials(vet.fullName)}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <div className="flex items-center gap-3 mb-1">
                                                                    <h3 className="text-lg font-semibold">{vet.fullName}</h3>
                                                                    <Badge
                                                                        variant={vet.status === UserStatus.ACTIVE ? "default" : "secondary"}
                                                                    >
                                                                        {userStatusLabels[vet.status] ?? vet.status}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground mb-2">
                                                                    CRMV: {vet.crmv ?? "N/A"} - Entrou em {formatDate(vet.createdAt)}
                                                                </p>
                                                            </div>

                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Acoes</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => navigate(`/admin/veterinarians/${vet.id}`)}
                                                                    >
                                                                        <FileText className="h-4 w-4 mr-2" />
                                                                        Ver Detalhes
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        <Edit className="h-4 w-4 mr-2" />
                                                                        Editar
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleToggleStatus(vet.id, vet.status)}>
                                                                        <Shield className="h-4 w-4 mr-2" />
                                                                        {vet.status === UserStatus.ACTIVE ? "Desativar" : "Ativar"}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <DropdownMenuItem
                                                                                className="text-destructive"
                                                                                onSelect={(e) => e.preventDefault()}
                                                                            >
                                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                                Excluir
                                                                            </DropdownMenuItem>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>Confirmar exclusao</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    Tem certeza que deseja excluir {vet.fullName}? Esta acao
                                                                                    nao pode ser desfeita.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    onClick={() => handleDeleteVet(vet.id)}
                                                                                    className="bg-destructive hover:bg-destructive/90"
                                                                                >
                                                                                    Excluir
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-muted-foreground">{vet.email}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-muted-foreground">{vet.phone ?? "N/A"}</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground mb-1">
                                                                    Consultas
                                                                </p>
                                                                <p className="text-sm font-semibold">{totalConsultations}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground mb-1">
                                                                    Aderencia
                                                                </p>
                                                                <p
                                                                    className={`text-sm font-bold ${
                                                                        adherence >= 90
                                                                            ? "text-green-600"
                                                                            : adherence >= 80
                                                                                ? "text-orange-600"
                                                                                : "text-red-600"
                                                                    }`}
                                                                >
                                                                    {adherence}%
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 pt-3 border-t border-border">
                                                            <p className="text-xs text-muted-foreground">
                                                                Ultimo acesso: {vet.lastLogin ? formatDateTime(vet.lastLogin) : "Nunca"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>

                            {veterinarians.length === 0 && (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                            <Search className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Nenhum veterinario encontrado
                                        </h3>
                                        <p className="text-muted-foreground mb-4">
                                            Tente ajustar o termo de busca
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

export default AdminVeterinarians;
