import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useValidateResetToken, useResetPassword } from '@/hooks/usePasswordRecovery';
import { useState, useEffect } from 'react';

const formSchema = z
    .object({
        newPassword: z
            .string()
            .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
            .regex(/[a-z]/, { message: 'A senha deve conter pelo menos uma letra minúscula' })
            .regex(/[A-Z]/, { message: 'A senha deve conter pelo menos uma letra maiúscula' })
            .regex(/\d/, { message: 'A senha deve conter pelo menos um número' }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],
    });

type FormData = z.infer<typeof formSchema>;

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [success, setSuccess] = useState(false);

    const token = searchParams.get('token');

    const queryResult = useValidateResetToken(token);
    const { data: userInfo, isLoading: isValidating, isError: isTokenInvalid, status, fetchStatus, error } = queryResult;

    const resetPassword = useResetPassword();

    const isTokenValid = !!userInfo?.valid;

    // DEBUG - remover depois
    console.log('[FRONTEND DEBUG]', {
        token: token?.substring(0, 10) + '...',
        status,
        fetchStatus,
        isValidating,
        isTokenInvalid,
        isTokenValid,
        userInfo,
        error: error?.message,
    });

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });

    useEffect(() => {
        if (isTokenInvalid) {
            toast({
                variant: 'destructive',
                title: 'Token inválido',
                description: 'Este link de recuperação é inválido ou expirou.',
            });
        }
    }, [isTokenInvalid, toast]);

    const onSubmit = async (data: FormData) => {
        if (!token) return;

        try {
            const response = await resetPassword.mutateAsync({
                token,
                newPassword: data.newPassword,
            });

            setSuccess(true);

            toast({
                title: 'Senha redefinida!',
                description: response.message,
            });

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description:
                    error.response?.data?.message ||
                    'Erro ao redefinir senha. Tente novamente.',
            });
        }
    };

    // Estado de carregamento
    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700">
                <Card className="w-full max-w-md shadow-2xl">
                    <CardContent className="pt-12 pb-12">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="text-muted-foreground">Validando token...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Token inválido
    if (!token || isTokenInvalid || !isTokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 p-4">
                <Card className="w-full max-w-md shadow-2xl">
                    <CardHeader>
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-destructive/10 p-3 rounded-full">
                                <AlertCircle className="h-8 w-8 text-destructive" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl text-center">Link Inválido</CardTitle>
                        <CardDescription className="text-center">
                            Este link de recuperação é inválido ou expirou
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Alert className="mb-4 border-destructive/50 bg-destructive/5">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Token Expirado</AlertTitle>
                            <AlertDescription>
                                Links de recuperação são válidos por apenas 1 hora por motivos de
                                segurança.
                            </AlertDescription>
                        </Alert>

                        <Link to="/forgot-password">
                            <Button className="w-full">Solicitar Novo Link</Button>
                        </Link>

                        <Link to="/login">
                            <Button variant="ghost" className="w-full mt-2">
                                Voltar para o login
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Sucesso
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 p-4">
                <Card className="w-full max-w-md shadow-2xl">
                    <CardHeader>
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-green-100 p-3 rounded-full">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl text-center">
                            Senha Redefinida!
                        </CardTitle>
                        <CardDescription className="text-center">
                            Sua senha foi alterada com sucesso
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Alert className="border-green-200 bg-green-50">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                Você já pode fazer login com sua nova senha.
                                <br />
                                <span className="text-sm">Redirecionando em 3 segundos...</span>
                            </AlertDescription>
                        </Alert>

                        <Link to="/login">
                            <Button className="w-full mt-4">Ir para Login</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Formulário de reset
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <KeyRound className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">
                        Redefinir Senha
                    </CardTitle>
                    <CardDescription className="text-center">
                        Olá, <strong>{userInfo?.fullName}</strong>! <br />
                        Defina sua nova senha abaixo
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nova Senha</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Mínimo 6 caracteres"
                                                disabled={resetPassword.isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar Senha</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Digite a senha novamente"
                                                disabled={resetPassword.isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={resetPassword.isPending}>
                                {resetPassword.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Redefinindo...
                                    </>
                                ) : (
                                    'Redefinir Senha'
                                )}
                            </Button>
                        </form>
                    </Form>

                    <Link to="/login">
                        <Button variant="ghost" className="w-full mt-4">
                            Voltar para o login
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
