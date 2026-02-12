import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, AlertCircle } from "lucide-react";

interface ConsentModalProps {
    isOpen: boolean;
    onConsent: (consent: boolean) => void;
}

const ConsentModal = ({ isOpen, onConsent }: ConsentModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={() => onConsent(false)}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Mic className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Consentimento de Gravação</DialogTitle>
                            <DialogDescription>Conformidade LGPD</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                        <strong>IMPORTANTE:</strong> Esta consulta será gravada e transcrita
                        automaticamente para auxiliar no preenchimento do checklist e documentação
                        médica.
                    </AlertDescription>
                </Alert>

                <div className="space-y-3 py-4">
                    <p className="text-sm text-muted-foreground">
                        <strong>O que será gravado:</strong>
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 pl-4 list-disc">
                        <li>Áudio da consulta veterinária</li>
                        <li>Perguntas do médico veterinário</li>
                        <li>Respostas do tutor do animal</li>
                    </ul>

                    <p className="text-sm text-muted-foreground mt-4">
                        <strong>Seus direitos:</strong>
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 pl-4 list-disc">
                        <li>A gravação será armazenada por 30 dias</li>
                        <li>Você pode solicitar acesso ou exclusão a qualquer momento</li>
                        <li>Os dados são protegidos conforme a LGPD</li>
                    </ul>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">
                        Por favor, confirme verbalmente durante a gravação:
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                        "Eu, [nome do tutor], autorizo a gravação desta consulta veterinária."
                    </p>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onConsent(false)}>
                        Não Autorizo
                    </Button>
                    <Button onClick={() => onConsent(true)}>
                        Autorizo a Gravação
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConsentModal;