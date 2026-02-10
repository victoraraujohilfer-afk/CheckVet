import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/layout/AdminSidebar";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    Home,
    Users,
    BarChart3,
    Settings,
    LogOut,
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
import logo from "@/assets/checkvet-logo-new.png";

const AdminVeterinarians = () => {
    const navigate = useNavigate();
    const [user] = useState({
        name: "Dr. Roberto Mendes",
        role: "Administrador",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newVet, setNewVet] = useState({
        name: "",
        email: "",
        crmv: "",
        phone: "",
        role: "veterinario",
    });

    const veterinarians = [
        {
            id: 1,
            name: "Dr. Carlos Silva",
            email: "carlos.silva@checkvet.com",
            crmv: "SP-12345",
            phone: "(11) 98765-4321",
            consultations: 156,
            adherence: 92,
            status: "active",
            lastLogin: "Hoje às 15:30",
            joinedAt: "15/01/2024",
        },
        {
            id: 2,
            name: "Dra. Ana Costa",
            email: "ana.costa@checkvet.com",
            crmv: "SP-23456",
            phone: "(11) 98765-4322",
            consultations: 142,
            adherence: 95,
            status: "active",
            lastLogin: "Hoje às 14:45",
            joinedAt: "20/01/2024",
        },
        {
            id: 3,
            name: "Dr. Pedro Oliveira",
            email: "pedro.oliveira@checkvet.com",
            crmv: "SP-34567",
            phone: "(11) 98765-4323",
            consultations: 128,
            adherence: 88,
            status: "active",
            lastLogin: "Hoje às 13:20",
            joinedAt: "01/02/2024",
        },
        {
            id: 4,
            name: "Dra. Mariana Santos",
            email: "mariana.santos@checkvet.com",
            crmv: "SP-45678",
            phone: "(11) 98765-4324",
            consultations: 134,
            adherence: 78,
            status: "inactive",
            lastLogin: "3 dias atrás",
            joinedAt: "10/02/2024",
        },
    ];

    const filteredVets = veterinarians.filter((vet) =>
        vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vet.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vet.crmv.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddVet = () => {
        // TODO: Integrar com backend
        console.log("Novo veterinário:", newVet);
        toast.success("Veterinário cadastrado com sucesso!");
        setIsAddDialogOpen(false);
        setNewVet({
            name: "",
            email: "",
            crmv: "",
            phone: "",
            role: "veterinario",
        });
    };

    const handleDeleteVet = (vetId: number) => {
        // TODO: Integrar com backend
        console.log("Deletar veterinário:", vetId);
        toast.success("Veterinário removido com sucesso!");
    };

    const handleToggleStatus = (vetId: number) => {
        // TODO: Integrar com backend
        console.log("Alterar status do veterinário:", vetId);
        toast.success("Status atualizado!");
    };

    return (
        <div className="min-h-screen bg-muted/30">
            <AdminSidebar
                userName={user.name}
                userRole={user.role}
                userInitials="RM"
            />

            {/* Sidebar */}
            {/* Main Content */}
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
                                        Gerenciar Veterinários
                                    </h1>
                                </div>
                                <p className="text-muted-foreground ml-12">
                                    Cadastre e gerencie os veterinários do hospital
                                </p>
                            </div>

                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Novo Veterinário
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>Cadastrar Novo Veterinário</DialogTitle>
                                        <DialogDescription>
                                            Preencha os dados do veterinário para criar uma nova conta
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Nome Completo</Label>
                                            <Input
                                                id="name"
                                                placeholder="Dr. João Silva"
                                                value={newVet.name}
                                                onChange={(e) =>
                                                    setNewVet({ ...newVet, name: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="joao.silva@checkvet.com"
                                                value={newVet.email}
                                                onChange={(e) =>
                                                    setNewVet({ ...newVet, email: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="crmv">CRMV</Label>
                                                <Input
                                                    id="crmv"
                                                    placeholder="SP-12345"
                                                    value={newVet.crmv}
                                                    onChange={(e) =>
                                                        setNewVet({ ...newVet, crmv: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="phone">Telefone</Label>
                                                <Input
                                                    id="phone"
                                                    placeholder="(11) 98765-4321"
                                                    value={newVet.phone}
                                                    onChange={(e) =>
                                                        setNewVet({ ...newVet, phone: e.target.value })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="role">Função</Label>
                                            <Select
                                                value={newVet.role}
                                                onValueChange={(value) =>
                                                    setNewVet({ ...newVet, role: value })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="veterinario">Veterinário</SelectItem>
                                                    <SelectItem value="gestor">Gestor</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsAddDialogOpen(false)}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button onClick={handleAddVet}>Cadastrar</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
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
                                        <p className="text-2xl font-bold">
                                            {veterinarians.filter((v) => v.status === "active").length}
                                        </p>
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
                                        <p className="text-2xl font-bold">
                                            {veterinarians.filter((v) => v.status === "inactive").length}
                                        </p>
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
                                        <p className="text-sm text-muted-foreground">Aderência Média</p>
                                        <p className="text-2xl font-bold">
                                            {Math.round(
                                                veterinarians.reduce((acc, v) => acc + v.adherence, 0) /
                                                veterinarians.length
                                            )}
                                            %
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Veterinarians List */}
                    <div className="grid gap-4">
                        {filteredVets.map((vet) => (
                            <Card key={vet.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-6">
                                        <Avatar className="h-16 w-16">
                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                                                {vet.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-lg font-semibold">{vet.name}</h3>
                                                        <Badge
                                                            variant={vet.status === "active" ? "default" : "secondary"}
                                                        >
                                                            {vet.status === "active" ? "Ativo" : "Inativo"}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        CRMV: {vet.crmv} • Entrou em {vet.joinedAt}
                                                    </p>
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
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
                                                        <DropdownMenuItem onClick={() => handleToggleStatus(vet.id)}>
                                                            <Shield className="h-4 w-4 mr-2" />
                                                            {vet.status === "active" ? "Desativar" : "Ativar"}
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
                                                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Tem certeza que deseja excluir {vet.name}? Esta ação
                                                                        não pode ser desfeita.
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
                                                    <span className="text-muted-foreground">{vet.phone}</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        Consultas
                                                    </p>
                                                    <p className="text-sm font-semibold">{vet.consultations}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        Aderência
                                                    </p>
                                                    <p
                                                        className={`text-sm font-bold ${vet.adherence >= 90
                                                                ? "text-green-600"
                                                                : vet.adherence >= 80
                                                                    ? "text-orange-600"
                                                                    : "text-red-600"
                                                            }`}
                                                    >
                                                        {vet.adherence}%
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-3 pt-3 border-t border-border">
                                                <p className="text-xs text-muted-foreground">
                                                    Último acesso: {vet.lastLogin}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredVets.length === 0 && (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                    <Search className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Nenhum veterinário encontrado
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Tente ajustar o termo de busca
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminVeterinarians;