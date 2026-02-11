import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Bell,
    Shield,
    Database,
    Save,
    FileText,
    Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings, useUpdateSettings } from "@/hooks/useApiHooks";
import { BackupFrequency } from "@/types/api";
import { roleLabels, backupFrequencyLabels } from "@/utils/enum-labels";
import { getInitials } from "@/utils/format";

const Settings = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: settingsData, isLoading } = useSettings();
    const updateSettings = useUpdateSettings();

    const [settings, setSettings] = useState({
        hospitalName: "",
        emailNotifications: true,
        smsNotifications: false,
        adherenceThreshold: 80,
        autoBackup: true,
        backupFrequency: BackupFrequency.DAILY as string,
        requireDocumentation: true,
        allowEditing: false,
    });

    useEffect(() => {
        if (settingsData) {
            setSettings({
                hospitalName: settingsData.hospitalName,
                emailNotifications: settingsData.emailNotifications,
                smsNotifications: settingsData.smsNotifications,
                adherenceThreshold: settingsData.adherenceThreshold,
                autoBackup: settingsData.autoBackup,
                backupFrequency: settingsData.backupFrequency,
                requireDocumentation: settingsData.requireDocumentation,
                allowEditing: settingsData.allowEditing,
            });
        }
    }, [settingsData]);

    const handleSave = () => {
        updateSettings.mutate(
            {
                hospitalName: settings.hospitalName,
                emailNotifications: settings.emailNotifications,
                smsNotifications: settings.smsNotifications,
                adherenceThreshold: settings.adherenceThreshold,
                autoBackup: settings.autoBackup,
                backupFrequency: settings.backupFrequency as BackupFrequency,
                requireDocumentation: settings.requireDocumentation,
                allowEditing: settings.allowEditing,
            },
            {
                onSuccess: () => toast.success("Configurações salvas com sucesso!"),
                onError: (err: any) => toast.error(err?.response?.data?.message ?? "Erro ao salvar configurações"),
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
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Configurações do Sistema
                        </h1>
                        <p className="text-muted-foreground">
                            Gerenciar preferências e configurações globais
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Hospital Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Informações do Hospital
                                    </CardTitle>
                                    <CardDescription>
                                        Dados básicos da instituição
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="hospitalName">Nome do Hospital</Label>
                                        <Input
                                            id="hospitalName"
                                            value={settings.hospitalName}
                                            onChange={(e) =>
                                                setSettings({ ...settings, hospitalName: e.target.value })
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Notifications */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="h-5 w-5" />
                                        Notificações
                                    </CardTitle>
                                    <CardDescription>
                                        Configure alertas e notificações
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Notificações por Email</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Receber alertas de aderência por email
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.emailNotifications}
                                            onCheckedChange={(checked) =>
                                                setSettings({ ...settings, emailNotifications: checked })
                                            }
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Notificações por SMS</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Receber alertas críticos por SMS
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.smsNotifications}
                                            onCheckedChange={(checked) =>
                                                setSettings({ ...settings, smsNotifications: checked })
                                            }
                                        />
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <Label htmlFor="threshold">Limite de Aderência (%)</Label>
                                        <Select
                                            value={String(settings.adherenceThreshold)}
                                            onValueChange={(value) =>
                                                setSettings({ ...settings, adherenceThreshold: parseInt(value) })
                                            }
                                        >
                                            <SelectTrigger id="threshold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="70">70%</SelectItem>
                                                <SelectItem value="80">80%</SelectItem>
                                                <SelectItem value="90">90%</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-sm text-muted-foreground">
                                            Receber alerta quando aderência ficar abaixo deste valor
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Security & Backup */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        Segurança e Backup
                                    </CardTitle>
                                    <CardDescription>
                                        Configurações de segurança e backup de dados
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Backup Automático</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Realizar backup automático dos dados
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.autoBackup}
                                            onCheckedChange={(checked) =>
                                                setSettings({ ...settings, autoBackup: checked })
                                            }
                                        />
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <Label htmlFor="backupFrequency">Frequência de Backup</Label>
                                        <Select
                                            value={settings.backupFrequency}
                                            onValueChange={(value) =>
                                                setSettings({ ...settings, backupFrequency: value })
                                            }
                                        >
                                            <SelectTrigger id="backupFrequency">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(BackupFrequency).map((f) => (
                                                    <SelectItem key={f} value={f}>{backupFrequencyLabels[f]}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Protocol Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Database className="h-5 w-5" />
                                        Protocolos Clínicos
                                    </CardTitle>
                                    <CardDescription>
                                        Configurações de uso dos protocolos
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Exigir Documentação</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Obrigar anexo de documentos em consultas
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.requireDocumentation}
                                            onCheckedChange={(checked) =>
                                                setSettings({ ...settings, requireDocumentation: checked })
                                            }
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Permitir Edição Posterior</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Veterinários podem editar consultas após conclusão
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.allowEditing}
                                            onCheckedChange={(checked) =>
                                                setSettings({ ...settings, allowEditing: checked })
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <Button size="lg" onClick={handleSave} disabled={updateSettings.isPending}>
                                    {updateSettings.isPending ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    Salvar Configurações
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Settings;
