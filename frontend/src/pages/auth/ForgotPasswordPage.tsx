import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useForgotPassword } from '@/hooks/usePasswordRecovery';

const formSchema = z.object({
    email: z.string().email({ message: 'Digite um email válido' }),
});

type FormData = z.infer<typeof formSchema>;

export function ForgotPasswordPage() {
    const { toast } = useToast();
    const forgotPassword = useForgotPassword();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            const response = await forgotPassword.mutateAsync(data);

            form.reset();

            toast({
                title: 'Email enviado!',
                description: response.message,
            });
        } catch {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Erro ao enviar email. Tente novamente.',
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Mail className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">
                        Recuperar Senha
                    </CardTitle>
                    <CardDescription className="text-center">
                        Digite seu email para receber instruções de recuperação
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {forgotPassword.isSuccess ? (
                        <Alert className="border-green-200 bg-green-50">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                Se o email estiver cadastrado, você receberá instruções para
                                recuperar sua senha em instantes.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="seu@email.com"
                                                    disabled={forgotPassword.isPending}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={forgotPassword.isPending}
                                >
                                    {forgotPassword.isPending ? 'Enviando...' : 'Enviar Instruções'}
                                </Button>
                            </form>
                        </Form>
                    )}

                    <div className="mt-6">
                        <Link to="/login">
                            <Button variant="ghost" className="w-full">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar para o login
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
