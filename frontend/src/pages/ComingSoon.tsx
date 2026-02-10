import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Construction, Home } from "lucide-react";

const ComingSoon = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-detectar contexto baseado na rota
  const getPageInfo = () => {
    const path = location.pathname;

    if (path.includes("/vet/consultation/")) {
      return {
        title: "Detalhes da Consulta",
        description: "Página de visualização completa da consulta em desenvolvimento.",
        features: [
          "Visualização completa do prontuário SOAP",
          "Histórico de procedimentos realizados",
          "Anexos e exames complementares",
          "Edição de consultas pendentes",
          "Exportação em PDF"
        ],
        backRoute: "/vet/history",
        backLabel: "Voltar ao Histórico"
      };
    }

    if (path.includes("/admin/veterinarians/new")) {
      return {
        title: "Cadastrar Veterinário",
        description: "Formulário para cadastro de novos veterinários no sistema.",
        features: [
          "Dados pessoais e profissionais",
          "Registro de CRMV",
          "Definição de permissões",
          "Protocolos associados",
          "Configurações de notificação"
        ],
        backRoute: "/admin/veterinarians",
        backLabel: "Voltar para Veterinários"
      };
    }

    if (path.includes("/admin/veterinarians/")) {
      return {
        title: "Perfil do Veterinário",
        description: "Visualização completa e edição do perfil do veterinário.",
        features: [
          "Estatísticas de desempenho",
          "Histórico de consultas",
          "Aderência aos protocolos",
          "Certificações e especializações",
          "Gestão de permissões"
        ],
        backRoute: "/admin/veterinarians",
        backLabel: "Voltar para Veterinários"
      };
    }

    if (path.includes("/admin/analytics")) {
      return {
        title: "Relatórios e Analytics",
        description: "Dashboard analítico com métricas e indicadores de desempenho.",
        features: [
          "Gráficos de aderência por período",
          "Ranking de veterinários",
          "Taxa de completude de protocolos",
          "Alertas e desvios de protocolo",
          "Exportação de relatórios personalizados"
        ],
        backRoute: "/admin/dashboard",
        backLabel: "Voltar ao Dashboard"
      };
    }

    if (path.includes("/admin/settings")) {
      return {
        title: "Configurações do Sistema",
        description: "Gerenciamento de configurações globais e preferências.",
        features: [
          "Gerenciar protocolos clínicos",
          "Configurar notificações",
          "Integrações com sistemas externos",
          "Customização de campos",
          "Backup e segurança"
        ],
        backRoute: "/admin/dashboard",
        backLabel: "Voltar ao Dashboard"
      };
    }

    // Default genérico
    return {
      title: "Em Desenvolvimento",
      description: "Esta funcionalidade está sendo desenvolvida e estará disponível em breve.",
      features: [],
      backRoute: "/",
      backLabel: "Voltar para Home"
    };
  };

  const { title, description, features, backRoute, backLabel } = getPageInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-2">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Construction className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription className="text-base mt-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {features.length > 0 && (
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold mb-3 text-foreground">
                Funcionalidades Planejadas:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 space-y-2">
            <Button
              className="w-full"
              onClick={() => navigate(backRoute)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/")}
            >
              <Home className="h-4 w-4 mr-2" />
              Ir para Home
            </Button>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Esta página será implementada na próxima versão do CheckVet
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoon;