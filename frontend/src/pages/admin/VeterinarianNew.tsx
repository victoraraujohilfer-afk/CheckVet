import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Save,
    ArrowLeft,
    User,
    FileText,
    Shield,
    Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateUser } from "@/hooks/useApiHooks";
import { Role, Specialization } from "@/types/api";
import { roleLabels, specializationLabels } from "@/utils/enum-labels";
import { getInitials } from "@/utils/format";

const VeterinarianNew = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        crmv: "",
        phone: "",
        specialization: "",
        password: "",
        confirmPassword: "",
    });

    const createUser = useCreateUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("As senhas não coincidem.");
            return;
        }

        createUser.mutate(
            {
                fullName: formData.name,
                email: formData.email,
                password: formData.password,
                role: Role.VETERINARIAN,
                phone: formData.phone,
                crmv: formData.crmv,
                specialization: formData.specialization ? (formData.specialization as Specialization) : undefined,
            },
            {
                onSuccess: () => {
                    toast.success(`${formData.name} foi cadastrado com sucesso.`);
                    navigate("/admin/veterinarians");
                },
                onError: (err: any) => {
                    toast.error(err?.response?.data?.message ?? "Erro ao cadastrar veterinário");
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-muted/30">
            <AdminSidebar
                userName={user?.fullName}
                userRole={user?.role ? roleLabels[user.role] : undefined}
                userInitials={user?.fullName ? getInitials(user.fullName) : "??"}
            />

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
                                    <div className="space-y-2 md:col-span-2">
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
                                                {Object.values(Specialization).map((s) => (
                                                    <SelectItem key={s} value={s}>{specializationLabels[s]}</SelectItem>
                                                ))}
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
                                        O veterinário poderá alterar a senha no primeiro login.
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
                                disabled={createUser.isPending}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" size="lg" disabled={createUser.isPending}>
                                {createUser.isPending ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
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
