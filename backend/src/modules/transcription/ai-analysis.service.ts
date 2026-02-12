import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../../prisma/prisma.service';

interface ChecklistItem {
    id: string;
    name: string;
    isRequired: boolean;
}

interface AnalysisResult {
    itemsToCheck: {
        itemId: string;
        confidence: number;
        reasoning: string;
        transcript: string;
    }[];
    fullAnalysis: string;
}

@Injectable()
export class AIAnalysisService {
    private anthropic: Anthropic;

    constructor(private prisma: PrismaService) {
        this.anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
    }

    /**
     * Analisa transcrição e identifica quais items do checklist foram mencionados
     */
    async analyzeTranscript(
        consultationId: string,
        transcript: string,
    ): Promise<AnalysisResult> {
        // 1. Buscar checklist da consulta
        const consultation = await this.prisma.consultation.findUnique({
            where: { id: consultationId },
            include: {
                protocol: {
                    include: {
                        items: {
                            orderBy: { order: 'asc' },
                        },
                    },
                },
                checklist: {
                    include: {
                        protocolItem: true,
                    },
                },
            },
        });

        if (!consultation?.protocol?.items) {
            throw new Error('Consulta sem protocolo associado');
        }

        // 2. Preparar items do checklist ainda não marcados
        const checklistItems = consultation.checklist
            .filter((item) => !item.completed) // Só analisa os não marcados
            .map((item) => ({
                id: item.protocolItemId,
                name: item.protocolItem.name,
                isRequired: item.protocolItem.isRequired,
            }));

        if (checklistItems.length === 0) {
            return {
                itemsToCheck: [],
                fullAnalysis: 'Todos os items já foram marcados.',
            };
        }

        // 3. Criar prompt para Claude
        const prompt = this.buildAnalysisPrompt(transcript, checklistItems);

        // 4. Chamar Claude API
        const response = await this.anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            temperature: 0.3, // Mais conservador
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        // 5. Parsear resposta JSON da IA
        const content = response.content[0];
        if (content.type !== 'text') {
            throw new Error('Resposta inesperada da IA');
        }

        const result = this.parseAIResponse(content.text);

        return result;
    }

    /**
     * Constrói o prompt otimizado para Claude
     */
    private buildAnalysisPrompt(
        transcript: string,
        checklistItems: ChecklistItem[],
    ): string {
        const itemsList = checklistItems
            .map((item, index) => `${index + 1}. ID: ${item.id} | "${item.name}"`)
            .join('\n');

        return `Você é um assistente veterinário especializado em análise de consultas.

TAREFA: Analise a transcrição abaixo e identifique quais procedimentos do checklist foram REALIZADOS, MENCIONADOS ou PERGUNTADOS pelo veterinário.

TRANSCRIÇÃO DA CONSULTA:
"""
${transcript}
"""

CHECKLIST DISPONÍVEL:
${itemsList}

REGRAS IMPORTANTES:
1. Seja CONSERVADOR - só marque se tiver certeza (confiança >= 0.7)
2. Aceite SINÔNIMOS e variações (ex: "temperatura" = "febre", "olhos" = "avaliação ocular")
3. Perguntas do médico CONTAM como realização (ex: "vou medir a temperatura" = item realizado)
4. Extraia o TRECHO EXATO da transcrição que justifica cada item
5. Se não tiver certeza, NÃO marque (melhor o médico marcar manualmente)

FORMATO DE RESPOSTA (JSON):
{
  "items_to_check": [
    {
      "item_id": "id-do-item",
      "confidence": 0.95,
      "reasoning": "Por que este item deve ser marcado",
      "transcript_excerpt": "Trecho exato da conversa que justifica"
    }
  ],
  "analysis": "Resumo geral da análise"
}

RESPONDA APENAS COM O JSON, SEM TEXTO ADICIONAL.`;
    }

    /**
     * Parseia resposta JSON da IA
     */
    private parseAIResponse(text: string): AnalysisResult {
        try {
            // Remove markdown se vier
            const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            const parsed = JSON.parse(cleanText);

            return {
                itemsToCheck: parsed.items_to_check.map((item: any) => ({
                    itemId: item.item_id,
                    confidence: item.confidence,
                    reasoning: item.reasoning,
                    transcript: item.transcript_excerpt,
                })),
                fullAnalysis: parsed.analysis || '',
            };
        } catch (error) {
            console.error('Erro ao parsear resposta da IA:', text);
            throw new Error('IA retornou formato inválido');
        }
    }
}