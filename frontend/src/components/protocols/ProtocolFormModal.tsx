import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { useCreateProtocol, useUpdateProtocol } from "@/hooks/useApiHooks";
import { ProtocolType } from "@/types/api";
import type { Protocol } from "@/types/api";

interface ProtocolFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    protocol?: Protocol | null;
}

interface FormData {
    name: string;
    description: string;
    type: ProtocolType;
    items: { name: string; order: number; isRequired: boolean }[];
}

const ProtocolFormModal = ({ isOpen, onClose, protocol }: ProtocolFormModalProps) => {
    const isEditing = !!protocol;
    const createMutation = useCreateProtocol();
    const updateMutation = useUpdateProtocol();

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            name: "",
            description: "",
            type: ProtocolType.GENERAL_EXAM,
            items: [{ name: "", order: 1, isRequired: true }],
        },
    });

    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "items",
    });

    // Atualizar form quando editar protocolo
    useEffect(() => {
        if (protocol) {
            reset({
                name: protocol.name,
                description: protocol.description || "",
                type: protocol.type,
                items: protocol.items?.length
                    ? protocol.items.map((item) => ({
                        name: item.name,
                        order: item.order,
                        isRequired: item.isRequired,
                    }))
                    : [{ name: "", order: 1, isRequired: true }],
            });
        } else {
            reset({
                name: "",
                description: "",
                type: ProtocolType.GENERAL_EXAM,
                items: [{ name: "", order: 1, isRequired: true }],
            });
        }
    }, [protocol, reset]);

    const onSubmit = async (data: FormData) => {
        // Reordenar items
        const itemsWithOrder = data.items.map((item, index) => ({
            ...item,
            order: index + 1,
        }));

        const payload = {
            ...data,
            items: itemsWithOrder,
        };

        if (isEditing && protocol) {
            updateMutation.mutate(
                { id: protocol.id, data: payload },
                {
                    onSuccess: () => {
                        toast.success("Protocolo atualizado com sucesso!");
                        onClose();
                    },
                    onError: () => {
                        toast.error("Erro ao atualizar protocolo");
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Protocolo criado com sucesso!");
                    onClose();
                },
                onError: () => {
                    toast.error("Erro ao criar protocolo");
                },
            });
        }
    };

    const addItem = () => {
        append({ name: "", order: fields.length + 1, isRequired: true });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Editar Protocolo" : "Novo Protocolo"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Atualize as informações do protocolo"
                            : "Crie um novo protocolo personalizado com checklist"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Nome */}
                    <div>
                        <Label htmlFor="name">Nome do Protocolo *</Label>
                        <Input
                            id="name"
                            {...register("name", { required: "Nome é obrigatório" })}
                            placeholder="Ex: Exame Clínico Completo"
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Descrição */}
                    <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Descreva brevemente o objetivo deste protocolo"
                            rows={3}
                        />
                    </div>

                    {/* Tipo */}
                    <div>
                        <Label htmlFor="type">Tipo *</Label>
                        <Select
                            value={watch("type")}
                            onValueChange={(value) => setValue("type", value as ProtocolType)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ProtocolType.GENERAL_EXAM}>Exame Geral</SelectItem>
                                <SelectItem value={ProtocolType.VACCINATION}>Vacinação</SelectItem>
                                <SelectItem value={ProtocolType.EMERGENCY}>Emergência</SelectItem>
                                <SelectItem value={ProtocolType.PRE_SURGERY}>Pré-Cirúrgico</SelectItem>
                                <SelectItem value={ProtocolType.POST_SURGERY}>Pós-Cirúrgico</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Itens do Checklist */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <Label>Itens do Checklist *</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                <Plus className="h-4 w-4 mr-2" />
                                Adicionar Item
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="flex items-start gap-2 p-3 border rounded-lg bg-muted/30"
                                >
                                    <div className="flex items-center gap-2 flex-1">
                                        <div className="cursor-move">
                                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                {...register(`items.${index}.name`, {
                                                    required: "Nome do item é obrigatório",
                                                })}
                                                placeholder={`Item ${index + 1}`}
                                            />
                                            {errors.items?.[index]?.name && (
                                                <p className="text-xs text-destructive mt-1">
                                                    {errors.items[index]?.name?.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={watch(`items.${index}.isRequired`)}
                                                onCheckedChange={(checked) =>
                                                    setValue(`items.${index}.isRequired`, !!checked)
                                                }
                                            />
                                            <Label className="text-sm text-muted-foreground cursor-pointer">
                                                Obrigatório
                                            </Label>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => remove(index)}
                                            disabled={fields.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {fields.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                Adicione pelo menos um item ao checklist
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={createMutation.isPending || updateMutation.isPending}
                        >
                            {createMutation.isPending || updateMutation.isPending
                                ? "Salvando..."
                                : isEditing
                                    ? "Atualizar"
                                    : "Criar Protocolo"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ProtocolFormModal;