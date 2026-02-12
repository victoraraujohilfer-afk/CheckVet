"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAnalysisService = void 0;
const common_1 = require("@nestjs/common");
const sdk_1 = require("@anthropic-ai/sdk");
const prisma_service_1 = require("../../prisma/prisma.service");
let AIAnalysisService = class AIAnalysisService {
    constructor(prisma) {
        this.prisma = prisma;
        this.anthropic = new sdk_1.default({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
    }
    async analyzeTranscript(consultationId, transcript) {
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
        const checklistItems = consultation.checklist
            .filter((item) => !item.completed)
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
        const prompt = this.buildAnalysisPrompt(transcript, checklistItems);
        const response = await this.anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            temperature: 0.3,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });
        const content = response.content[0];
        if (content.type !== 'text') {
            throw new Error('Resposta inesperada da IA');
        }
        const result = this.parseAIResponse(content.text);
        return result;
    }
    buildAnalysisPrompt(transcript, checklistItems) {
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
    parseAIResponse(text) {
        try {
            const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const parsed = JSON.parse(cleanText);
            return {
                itemsToCheck: parsed.items_to_check.map((item) => ({
                    itemId: item.item_id,
                    confidence: item.confidence,
                    reasoning: item.reasoning,
                    transcript: item.transcript_excerpt,
                })),
                fullAnalysis: parsed.analysis || '',
            };
        }
        catch (error) {
            console.error('Erro ao parsear resposta da IA:', text);
            throw new Error('IA retornou formato inválido');
        }
    }
};
exports.AIAnalysisService = AIAnalysisService;
exports.AIAnalysisService = AIAnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AIAnalysisService);
//# sourceMappingURL=ai-analysis.service.js.map