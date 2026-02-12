import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2 } from "lucide-react";

interface TranscriptDisplayProps {
    transcript: string;
    isAnalyzing?: boolean;
    duration: number;
}

const TranscriptDisplay = ({
    transcript,
    isAnalyzing = false,
    duration,
}: TranscriptDisplayProps) => {
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Transcrição em Tempo Real
                    </CardTitle>
                    <Badge variant="outline">{formatDuration(duration)}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                {isAnalyzing && (
                    <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-sm text-blue-900 font-medium">
                            Analisando transcrição com IA...
                        </span>
                    </div>
                )}

                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    {transcript ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {transcript}
                        </p>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p className="text-sm">Aguardando transcrição...</p>
                        </div>
                    )}
                </ScrollArea>

                {transcript && (
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{transcript.split(' ').length} palavras</span>
                        <span>{transcript.length} caracteres</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TranscriptDisplay;