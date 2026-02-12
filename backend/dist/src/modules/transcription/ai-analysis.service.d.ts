import { PrismaService } from '../../prisma/prisma.service';
interface AnalysisResult {
    itemsToCheck: {
        itemId: string;
        confidence: number;
        reasoning: string;
        transcript: string;
    }[];
    fullAnalysis: string;
}
export declare class AIAnalysisService {
    private prisma;
    private anthropic;
    constructor(prisma: PrismaService);
    analyzeTranscript(consultationId: string, transcript: string): Promise<AnalysisResult>;
    private buildAnalysisPrompt;
    private parseAIResponse;
}
export {};
