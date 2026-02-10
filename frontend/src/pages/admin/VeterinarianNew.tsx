import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    Save,
    ArrowLeft,
    User,
    FileText,
    Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/layout/AdminSidebar";

const VeterinarianNew = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [user] = useState({
        name: "Dr. Roberto Mendes",
        role: "Administrador",
    });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        crmv: "",
        phone: "",
        role: "",
        specialization: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Erro",
                description: "As senhas não coincidem.",
                variant: "destructive",
            });
            return;
        }

        // TODO: Integrar com backend
        toast({
            title: "Veterinário Cadastrado",
            description: `${formData.name} foi adicionado com sucesso.`,
        });

        setTimeout(() => {
            navigate("/admin/veterinarians");
        }, 1500);
    };

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
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/admin/veterinarians")}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">
                                    Cadastrar Veterinário
                                </h1>
                                <p className="text-muted-foreground">
                                    Adicione um novo veterinário ao sistema
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Dados Pessoais
                                </CardTitle>
                                <CardDescription>
                                    Informações básicas do veterinário
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="name">Nome Completo *</Label>
                                        <Input
                                            id="name"
                                            required
                                            placeholder="Ex: Dr. Carlos Silva"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            placeholder="carlos@email.com"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Telefone *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            required
                                            placeholder="(11) 98765-4321"
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({ ...formData, phone: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Professional Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Dados Profissionais
                                </CardTitle>
                                <CardDescription>
                                    Registro profissional e especialização
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="crmv">CRMV *</Label>
                                        <Input
                                            id="crmv"
                                            required
                                            placeholder="Ex: SP-12345"
                                            value={formData.crmv}
                                            onChange={(e) =>
                                                setFormData({ ...formData, crmv: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role">Função *</Label>
                                        <Select
                                            required
                                            value={formData.role}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, role: value })
                                            }
                                        >
                                            <SelectTrigger id="role">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="veterinarian">Veterinário</SelectItem>
                                                <SelectItem value="supervisor">Supervisor</SelectItem>
                                                <SelectItem value="coordinator">Coordenador</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="specialization">Especialização</Label>
                                        <Select
                                            value={formData.specialization}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, specialization: value })
                                            }
                                        >
                                            <SelectTrigger id="specialization">
                                                <SelectValue placeholder="Selecione (opcional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="general">Clínica Geral</SelectItem>
                                                <SelectItem value="surgery">Cirurgia</SelectItem>
                                                <SelectItem value="dermatology">Dermatologia</SelectItem>
                                                <SelectItem value="cardiology">Cardiologia</SelectItem>
                                                <SelectItem value="orthopedics">Ortopedia</SelectItem>
                                                <SelectItem value="oncology">Oncologia</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Access Credentials */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Credenciais de Acesso
                                </CardTitle>
                                <CardDescription>
                                    Senha inicial para login no sistema
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Senha *</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            placeholder="Mínimo 6 caracteres"
                                            value={formData.password}
                                            onChange={(e) =>
                                                setFormData({ ...formData, password: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            required
                                            placeholder="Repita a senha"
                                            value={formData.confirmPassword}
                                            onChange={(e) =>
                                                setFormData({ ...formData, confirmPassword: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                        💡 O veterinário receberá um email com as credenciais de acesso
                                        e poderá alterar a senha no primeiro login.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex gap-3 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/admin/veterinarians")}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" size="lg">
                                <Save className="h-4 w-4 mr-2" />
                                Cadastrar Veterinário
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default VeterinarianNew;