import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";
import logo from "@/assets/checkvet-logo-new.png";

const ChangePassword = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const isFirstLogin = user?.mustChangePassword === true;

    useEffect(() => {
        // Se não for primeiro login e não estiver autenticado, redireciona
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            toast.error("A nova senha deve ter no mínimo 6 caracteres");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("As senhas não coincidem");
            return;
        }

        setIsLoading(true);

        try {
            await authService.changePassword(
                isFirstLogin ? undefined : currentPassword,
                newPassword
            );

            toast.success("Senha alterada com sucesso!");

            // Fazer logout e redirecionar para login
            await logout();
            navigate("/login");
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Erro ao alterar senha. Tente novamente.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-primary via-primary to-accent">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <img
                        src={logo}
                        alt="CheckVet"
                        className="mx-auto"
                        style={{ maxHeight: '150px' }}
                    />
                </div>

                <Card className="border-2">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center gap-2 justify-center mb-2">
                            <Lock className="h-6 w-6 text-primary" />
                            <CardTitle className="text-2xl font-bold">
                                {isFirstLogin ? "Primeiro Acesso" : "Alterar Senha"}
                            </CardTitle>
                        </div>
                        <CardDescription className="text-center">
                            {isFirstLogin
                                ? "Por segurança, você deve alterar sua senha no primeiro acesso"
                                : "Defina uma nova senha para sua conta"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            {!isFirstLogin && (
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Senha Atual</Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showCurrentPassword ? "text" : "password"}
                                            placeholder="Digite sua senha atual"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                            className="h-11 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Nova Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Mínimo 6 caracteres"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="h-11 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Repita a nova senha"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="h-11 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Dica:</strong> Use uma senha forte com letras, números e caracteres especiais.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11"
                                disabled={isLoading}
                            >
                                {isLoading ? "Alterando..." : "Alterar Senha"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="mt-6 text-center text-sm text-white/90">
                    {isFirstLogin
                        ? "Após alterar sua senha, você será redirecionado para fazer login novamente"
                        : "Você será desconectado após alterar a senha"}
                </p>
            </div>
        </div>
    );
};

export default ChangePassword;
