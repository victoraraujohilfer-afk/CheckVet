import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/types/api";
import logo from "@/assets/checkvet-logo-new.png";

const Login = () => {
    const navigate = useNavigate();
    const { login, user, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Redirect when user becomes available after successful login
    useEffect(() => {
        if (isAuthenticated && user) {
            // Se deve trocar a senha, redireciona para a página de troca de senha
            if (user.mustChangePassword) {
                navigate("/change-password", { replace: true });
            } else if (user.role === Role.ADMIN) {
                navigate("/admin/dashboard", { replace: true });
            } else {
                navigate("/vet/dashboard", { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(email, password);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Credenciais inválidas. Tente novamente.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex relative">
            {/* Back Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="absolute top-4 left-4 z-20 hover:bg-white/10"
            >
                <ArrowLeft className="h-5 w-5" />
            </Button>

            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-accent relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10" />

                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    <div className="max-w-sm">
                        <img
                            src={logo}
                            alt="CheckVet"
                            className="w-full h-auto object-contain"
                            style={{ maxHeight: '800px' }}
                        />
                    </div>

                    <h1 className="text-4xl font-bold mb-6">
                        Padronize sua clínica,<br />
                        proteja seu hospital.
                    </h1>

                    <p className="text-lg text-white/90 mb-8">
                        O CheckVet garante que 100% dos seus veterinários sigam 100% dos protocolos clínicos em tempo real, com auditoria automática para a gestão.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                            <p className="text-white/80">Checklist clínico em tempo real</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                            <p className="text-white/80">Prontuário automático (SOAP)</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                            <p className="text-white/80">Auditoria de protocolo por veterinário</p>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-16 text-white/60 text-sm">
                    © 2026 CheckVet. Todos os direitos reservados.
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <img
                            src={logo}
                            alt="CheckVet"
                            style={{ maxHeight: '800px' }}
                        />
                    </div>

                    <Card className="border-2">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
                            <CardDescription>
                                Entre com suas credenciais para acessar o sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Senha</Label>
                                        <a
                                            href="/forgot-password"
                                            className="text-sm text-primary hover:underline"
                                        >
                                            Esqueceu a senha?
                                        </a>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="h-11 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Entrando..." : "Entrar"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Não tem uma conta?{" "}
                        <a href="/register" className="text-primary font-medium hover:underline">
                            Solicite acesso
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
