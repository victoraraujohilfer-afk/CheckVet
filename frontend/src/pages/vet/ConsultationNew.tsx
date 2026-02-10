import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowLeft,
    Save,
    Plus,
    CheckCircle2,
    Home,
    LogOut,
    History,
    Search,
    PawPrint,
    User,
    ClipboardList,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import VetSidebar from "@/components/layout/VetSidebar";

const ConsultationNew = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [user] = useState({
        name: "Dr. Carlos Silva",
        role: "Veterinário",
    });

    const [formData, setFormData] = useState({
        // Pet
        petName: "",
        petSpecies: "",
        petBreed: "",
        petAge: "",
        petWeight: "",
        petGender: "",

        // Tutor
        ownerName: "",
        ownerPhone: "",
        ownerEmail: "",

        // Consulta
        consultationType: "",
        protocol: "",
        chiefComplaint: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // TODO: Integrar com backend
        toast({
            title: "Consulta Iniciada",
            description: "Você será redirecionado para o checklist do protocolo.",
        });

        setTimeout(() => {
            navigate("/vet/consultation/1");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Sidebar */}
            <VetSidebar
                userName={user.name}
                userRole={user.role}
                userInitials="CS"
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
                                onClick={() => navigate("/vet/dashboard")}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">
                                    Nova Consulta
                                </h1>
                                <p className="text-muted-foreground">
                                    Preencha os dados para iniciar o atendimento
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Informações do Pet */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PawPrint className="h-5 w-5" />
                                    Dados do Paciente
                                </CardTitle>
                                <CardDescription>
                                    Informações do animal em atendimento
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-4 mb-4">
                                    <Button type="button" variant="outline" size="sm">
                                        <Search className="h-4 w-4 mr-2" />
                                        Buscar Paciente Existente
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="petName">Nome do Pet *</Label>
                                        <Input
                                            id="petName"
                                            required
                                            placeholder="Ex: Thor"
                                            value={formData.petName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, petName: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="petSpecies">Espécie *</Label>
                                        <Select
                                            required
                                            value={formData.petSpecies}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, petSpecies: value })
                                            }
                                        >
                                            <SelectTrigger id="petSpecies">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="canine">Canino</SelectItem>
                                                <SelectItem value="feline">Felino</SelectItem>
                                                <SelectItem value="avian">Ave</SelectItem>
                                                <SelectItem value="exotic">Exótico</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="petBreed">Raça</Label>
                                        <Input
                                            id="petBreed"
                                            placeholder="Ex: Golden Retriever"
                                            value={formData.petBreed}
                                            onChange={(e) =>
                                                setFormData({ ...formData, petBreed: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="petGender">Sexo *</Label>
                                        <Select
                                            required
                                            value={formData.petGender}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, petGender: value })
                                            }
                                        >
                                            <SelectTrigger id="petGender">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Macho</SelectItem>
                                                <SelectItem value="female">Fêmea</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="petAge">Idade</Label>
                                        <Input
                                            id="petAge"
                                            placeholder="Ex: 3 anos"
                                            value={formData.petAge}
                                            onChange={(e) =>
                                                setFormData({ ...formData, petAge: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="petWeight">Peso (kg)</Label>
                                        <Input
                                            id="petWeight"
                                            type="number"
                                            step="0.1"
                                            placeholder="Ex: 32.5"
                                            value={formData.petWeight}
                                            onChange={(e) =>
                                                setFormData({ ...formData, petWeight: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informações do Tutor */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Dados do Tutor
                                </CardTitle>
                                <CardDescription>
                                    Informações de contato do responsável
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="ownerName">Nome Completo *</Label>
                                        <Input
                                            id="ownerName"
                                            required
                                            placeholder="Ex: João Silva"
                                            value={formData.ownerName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, ownerName: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ownerPhone">Telefone *</Label>
                                        <Input
                                            id="ownerPhone"
                                            required
                                            type="tel"
                                            placeholder="(11) 98765-4321"
                                            value={formData.ownerPhone}
                                            onChange={(e) =>
                                                setFormData({ ...formData, ownerPhone: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ownerEmail">Email</Label>
                                        <Input
                                            id="ownerEmail"
                                            type="email"
                                            placeholder="joao@email.com"
                                            value={formData.ownerEmail}
                                            onChange={(e) =>
                                                setFormData({ ...formData, ownerEmail: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informações da Consulta */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5" />
                                    Dados da Consulta
                                </CardTitle>
                                <CardDescription>
                                    Tipo de atendimento e protocolo clínico
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="consultationType">Tipo de Consulta *</Label>
                                        <Select
                                            required
                                            value={formData.consultationType}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, consultationType: value })
                                            }
                                        >
                                            <SelectTrigger id="consultationType">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="routine">Rotina</SelectItem>
                                                <SelectItem value="vaccination">Vacinação</SelectItem>
                                                <SelectItem value="emergency">Emergência</SelectItem>
                                                <SelectItem value="surgery">Cirurgia</SelectItem>
                                                <SelectItem value="return">Retorno</SelectItem>
                                                <SelectItem value="exam">Exames</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="protocol">Protocolo Clínico *</Label>
                                        <Select
                                            required
                                            value={formData.protocol}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, protocol: value })
                                            }
                                        >
                                            <SelectTrigger id="protocol">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="general_exam">
                                                    Exame Clínico Geral
                                                </SelectItem>
                                                <SelectItem value="vaccination">
                                                    Protocolo de Vacinação
                                                </SelectItem>
                                                <SelectItem value="emergency">
                                                    Atendimento de Emergência
                                                </SelectItem>
                                                <SelectItem value="pre_surgery">
                                                    Pré-operatório Completo
                                                </SelectItem>
                                                <SelectItem value="post_surgery">
                                                    Acompanhamento Pós-cirúrgico
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="chiefComplaint">Queixa Principal</Label>
                                    <Textarea
                                        id="chiefComplaint"
                                        placeholder="Descreva o motivo da consulta e principais queixas do tutor..."
                                        rows={4}
                                        value={formData.chiefComplaint}
                                        onChange={(e) =>
                                            setFormData({ ...formData, chiefComplaint: e.target.value })
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Info Box */}
                        <Card className="border-primary/50 bg-primary/5">
                            <CardContent className="p-6">
                                <div className="flex gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-foreground">
                                            Protocolo Clínico em Tempo Real
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Após iniciar a consulta, você será guiado por um checklist
                                            interativo do protocolo selecionado. Todos os itens serão
                                            registrados automaticamente no prontuário SOAP.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex gap-3 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/vet/dashboard")}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" size="lg">
                                <Save className="h-4 w-4 mr-2" />
                                Iniciar Consulta
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ConsultationNew;