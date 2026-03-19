/**
 * ============================================================================
 * [M] MODEL: IAModel (Google Gemini API)
 * ARQUIVO: src/models/IAModel.ts
 * ============================================================================
 * DESCRIÇÃO:
 * Encapsula toda a comunicação com a LLM.
 * Formata os prompts e garante que a IA devolve JSONs estruturados,
 * evitando a quebra de código no frontend ou no webhook do Telegram.
 * ============================================================================
 */
import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "⚠️ FALHA CRÍTICA: GEMINI_API_KEY não encontrada no .env.local.",
  );
}

const genAI = new GoogleGenerativeAI(apiKey);
// Usamos o Flash 2.5 por ser o mais rápido e económico para triagem
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    isEscalated: { type: SchemaType.BOOLEAN, description: "True se for urgente ou precisar de humano." },
    suggestion: { type: SchemaType.STRING, description: "Passo a passo formatado em Markdown, ou vazio se escalado." }
  },
  required: ["isEscalated", "suggestion"],
};

    // Forçamos a IA a devolver um JSON rigoroso usando Schema nativo
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        isEscalated: {
          type: Type.BOOLEAN,
          description: "True se for urgente ou precisar de humano.",
        },
        suggestion: {
          type: Type.STRING,
          description:
            "Passo a passo formatado em Markdown, ou vazio se escalado.",
        },
      },
      required: ["isEscalated", "suggestion"],
    };

    const prompt = `
      Você é o Agente Virtual de Triagem (Nível 0) do SupportBox.
      REGRA 1: Se a mensagem indicar risco crítico (servidor caiu, sistema fora), isEscalated DEVE ser true.
      REGRA 2: Para problemas comuns de uso, forneça um tutorial curto.
      Problema: "${problemDescription}"
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    return JSON.parse(result.response.text());
  },

  /**
   * Processamento de comandos do Telegram (Texto ou Áudio)
   */
  async processTelegramCommand(promptParts: any[]) {
    // Este esquema substitui o uso frágil de Regex que você tinha no Webhook
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        ticket_id: {
          type: Type.STRING,
          description: "Ex: CH-1234. Null se não mencionado.",
        },
        action: {
          type: Type.STRING,
          description: "ATUALIZAR_STATUS, COMENTAR, ou DUVIDA",
        },
        status_alvo: {
          type: Type.STRING,
          description: "Aguardando Atendimento, Em Andamento, Concluído",
        },
        comment: {
          type: Type.STRING,
          description: "Tradução formal e técnica da fala do agente.",
        },
        resposta_assistente: {
          type: Type.STRING,
          description: "Resposta humanizada para enviar no Telegram.",
        },
      },
      required: ["action", "resposta_assistente"],
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: promptParts }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    return JSON.parse(result.response.text());
  },
};
