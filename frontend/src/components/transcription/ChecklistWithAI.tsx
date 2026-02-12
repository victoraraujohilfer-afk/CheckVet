import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CheckCircle2, AlertCircle, Clock, Sparkles, ChevronDown } from "lucide-react";
import { formatTime } from "@/utils/format";
import type { ConsultationChecklist } from "@/types/api";
import { useState } from "react";

interface ChecklistWithAIProps {
    checklist: ConsultationChecklist[];
    onToggle: (itemId: string, currentState: boolean) => void;
    isPending?: boolean;
}

const ChecklistWithAI = ({ checklist, onToggle, isPending = false }: ChecklistWithAIProps) => {
    const completedItems = checklist.filter(item => item.completed).length;
    const totalItems = checklist.length;
    const adherencePercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Checklist do Protocolo
                </CardTitle>
                <CardDescription>
                    {completedItems} de {totalItems} itens concluídos ({adherencePercentage}%)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {checklist.map((item) => (
                        <ChecklistItem
                            key={item.id}
                            item={item}
                            onToggle={onToggle}
                            isPending={isPending}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

interface ChecklistItemProps {
    item: ConsultationChecklist;
    onToggle: (itemId: string, currentState: boolean) => void;
    isPending: boolean;
}

const ChecklistItem = ({ item, onToggle, isPending }: ChecklistItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const hasAIData = item.autoChecked && item.aiTranscript;

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div
                className={`rounded-lg border transition-all ${item.completed
                        ? "bg-green-50 border-green-200"
                        : "bg-orange-50 border-orange-200"
                    } ${isPending ? "opacity-50 cursor-wait" : "cursor-pointer hover:shadow-sm"}`}
            >
                <div
                    className="flex items-center gap-3 p-3"
                    onClick={(e) => {
                        if ((e.target as HTMLElement).closest('button')) return;
                        onToggle(item.protocolItemId, item.completed);
                    }}
                >
                    <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => onToggle(item.protocolItemId, item.completed)}
                        disabled={isPending}
                        className="flex-shrink-0"
                    />

                    <div className="flex items-center gap-3 flex-1">
                        {item.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                        )}
                        <span
                            className={`text-sm font-medium ${item.completed ? "text-green-900" : "text-orange-900"
                                }`}
                        >
                            {item.protocolItem?.name ?? "Item"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Badge de IA */}
                        {hasAIData && (
                            <Badge variant="secondary" className="text-xs gap-1">
                                <Sparkles className="h-3 w-3" />
                                IA
                                {item.aiConfidence && (
                                    <span className="text-xs opacity-70">
                                        {Math.round(item.aiConfidence * 100)}%
                                    </span>
                                )}
                            </Badge>
                        )}

                        {/* Timestamp */}
                        {item.completedAt && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(item.completedAt)}
                            </span>
                        )}

                        {/* Botão de expandir */}
                        {hasAIData && (
                            <CollapsibleTrigger asChild>
                                <button
                                    className="p-1 hover:bg-white/50 rounded transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                            </CollapsibleTrigger>
                        )}
                    </div>
                </div>

                {/* Justificativa da IA */}
                {hasAIData && (
                    <CollapsibleContent>
                        <div className="px-3 pb-3 pt-0">
                            <div className="ml-11 pl-3 border-l-2 border-green-300 space-y-2">
                                <div className="bg-white p-3 rounded-md">
                                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                                        Trecho identificado pela IA:
                                    </p>
                                    <p className="text-sm italic text-foreground">
                                        "{item.aiTranscript}"
                                    </p>
                                </div>

                                {item.notes && (
                                    <div className="bg-white p-3 rounded-md">
                                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                                            Análise:
                                        </p>
                                        <p className="text-sm text-foreground">{item.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CollapsibleContent>
                )}
            </div>
        </Collapsible>
    );
};

export default ChecklistWithAI;