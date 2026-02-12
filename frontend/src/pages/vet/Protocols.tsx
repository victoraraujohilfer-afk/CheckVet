import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    ArrowLeft,
    Plus,
    Edit,
    Trash2,
    ClipboardList,
    Loader2,
    FileText,
} from "lucide-react";
import VetSidebar from "@/components/layout/VetSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useProtocols, useDeleteProtocol } from "@/hooks/useApiHooks";
import { protocolTypeLabels } from "@/utils/enum-labels";
import { getInitials, formatDate } from "@/utils/format";
import { toast } from "sonner";
import ProtocolFormModal from "@/components/protocols/ProtocolFormModal"; 
import type { Protocol } from "@/types/api";

const ProtocolsManagement = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProtocol, setEditingProtocol] = useState<Protocol | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [protocolToDelete, setProtocolToDelete] = useState<Protocol | null>(null);

    const { data: protocols, isLoading } = useProtocols();
    const deleteMutation = useDeleteProtocol();

    const handleCreate = () => {
        setEditingProtocol(null);
        setIsFormOpen(true);
    };

    const handleEdit = (protocol: Protocol) => {
        setEditingProtocol(protocol);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (protocol: Protocol) => {
        setProtocolToDelete(protocol);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!protocolToDelete) return;

        deleteMutation.mutate(protocolToDelete.id, {
            onSuccess: () => {
                toast.success("Protocolo deletado com sucesso!");
                setDeleteDialogOpen(false);
                setProtocolToDelete(null);
            },
            onError: () => {
                toast.error("Erro ao deletar protocolo");
            },
        });
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingProtocol(null);
    };

    return (
        <div className="min-h-screen bg-muted/30">
            <VetSidebar
                userName={user?.fullName ?? ""}
                userRole="Veterinário"
                userInitials={getInitials(user?.fullName ?? "")}
            />

            <main className="ml-64 p-8">
                <div className="max-w-7xl mx-auto">
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
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-foreground">
                                    Meus Protocolos
                                </h1>
                                <p className="text-muted-foreground">
                                    Gerencie seus checklists personalizados
                                </p>
                            </div>
                            <Button onClick={handleCreate}>
                                <Plus className="h-4 w-4 mr-2" />
                                Novo Protocolo
                            </Button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && protocols?.length === 0 && (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    <ClipboardList className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Nenhum protocolo criado</h3>
                                <p className="text-muted-foreground text-center mb-6 max-w-md">
                                    Crie seu primeiro protocolo personalizado para começar a usar checklists
                                    nas suas consultas
                                </p>
                                <Button onClick={handleCreate}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Criar Primeiro Protocolo
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Protocols Grid */}
                    {!isLoading && protocols && protocols.length > 0 && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {protocols.map((protocol) => (
                                <Card key={protocol.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg mb-2">{protocol.name}</CardTitle>
                                                <Badge variant="outline" className="mb-2">
                                                    {protocolTypeLabels[protocol.type]}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(protocol)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteClick(protocol)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                        {protocol.description && (
                                            <CardDescription className="line-clamp-2">
                                                {protocol.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Itens no checklist</span>
                                                <span className="font-medium">{protocol.items?.length ?? 0}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Usos</span>
                                                <span className="font-medium">{protocol._count?.consultations ?? 0}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Criado em</span>
                                                <span className="font-medium">{formatDate(protocol.createdAt)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Form Modal */}
            <ProtocolFormModal
                isOpen={isFormOpen}
                onClose={handleFormClose}
                protocol={editingProtocol}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar o protocolo "{protocolToDelete?.name}"?
                            Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Deletar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ProtocolsManagement;