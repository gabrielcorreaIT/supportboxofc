/**
 * CAMADA: Model — Integracao com IA (Google Gemini)
 * ARQUIVO: src/models/IAModel.ts
 *
 * DESCRICAO:
 *   Encapsula a comunicacao com a API do Google Gemini.
 *   O SupportBox usa IA em dois momentos:
 *
 *   1. TRIAGEM AUTOMATICA: a IA tenta resolver problemas simples
 *      antes do solicitante abrir um chamado formal.
 *
 *   2. COMANDOS DO TELEGRAM: a IA interpreta texto/audio do tecnico
 *      e devolve uma acao estruturada (atualizar status, comentar, etc).
 *
 * CONEXOES:
 *   - Depende de: Google Generative AI SDK, variavel GEMINI_API_KEY
 *   - Usado por:  TicketController (triagem), TelegramController (comandos)
 */
import {
  GoogleGenerativeAI,
  Schema,
  SchemaType,
  type Part,
  type Content,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const modelo = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const IAModel = {
  /**
   * TRIAGEM AUTOMATICA
   *
   * Recebe a descricao do problema e devolve:
   *   - { escalado: true } se for critico (precisa de humano)
   *   - { escalado: false, sugestao: "..." } com tutorial em Markdown
   */
  async analisarDeflexao(
    descricaoProblema: string,
  ): Promise<{ escalado: boolean; sugestao: string }> {
    const schema: Schema = {
      type: SchemaType.OBJECT,
      properties: {
        isEscalated: {
          type: SchemaType.BOOLEAN,
          description: "True se for critico e precisar de atendimento humano.",
        },
        suggestion: {
          type: SchemaType.STRING,
          description: "Passo a passo em Markdown. Vazio se isEscalated for true.",
        },
      },
      required: ["isEscalated", "suggestion"],
    };

    const prompt = `
      Voce e o Agente Virtual de Triagem (Nivel 0) do SupportBox.

      REGRAS:
      1. Se o problema indicar risco critico (servidor caiu, sistema fora do ar, perda de dados), defina isEscalated=true e suggestion vazio.
      2. Para problemas comuns (impressora, senha, internet lenta, app travado), forneca tutorial em Markdown com no maximo 4 passos.
      3. Use linguagem objetiva e corporativa.

      Problema: ${descricaoProblema}
    `;

    const resultado = await modelo.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const resposta = JSON.parse(resultado.response.text());
    return { escalado: resposta.isEscalated, sugestao: resposta.suggestion };
  },

  /**
   * PROCESSAMENTO DE COMANDOS DO TELEGRAM
   *
   * Recebe partes de uma mensagem (texto e/ou audio) e devolve uma acao:
   *   - ATUALIZAR_STATUS: tecnico quer mudar o status de um chamado
   *   - COMENTAR: tecnico quer adicionar uma nota ao chamado
   *   - DUVIDA: tecnico fez uma pergunta geral
   */
  async processarComandoTelegram(
    partesDaEntrada: Part[],
  ): Promise<{
    id_chamado: string | null;
    acao: "ATUALIZAR_STATUS" | "COMENTAR" | "DUVIDA";
    status_alvo: string | null;
    comentario: string | null;
    resposta_assistente: string;
  }> {
    const schema: Schema = {
      type: SchemaType.OBJECT,
      properties: {
        ticket_id: {
          type: SchemaType.STRING,
          description: "Protocolo do chamado (ex: CH-1234). Null se nao mencionado.",
          nullable: true,
        },
        action: {
          type: SchemaType.STRING,
          description: "Acao: ATUALIZAR_STATUS, COMENTAR ou DUVIDA.",
        },
        status_alvo: {
          type: SchemaType.STRING,
          description: "'Aberto', 'Em Andamento' ou 'Concluido'. Null se nao for atualizacao.",
          nullable: true,
        },
        comment: {
          type: SchemaType.STRING,
          description: "Traducao formal do comando para o historico. Null se nao houver.",
          nullable: true,
        },
        resposta_assistente: {
          type: SchemaType.STRING,
          description: "Resposta em pt-BR para enviar no Telegram.",
        },
      },
      required: ["action", "resposta_assistente"],
    };

    const parteSistema: Part = {
      text: `Voce e o assistente de campo do SupportBox para tecnicos de TI no Telegram.
      Interprete o comando de voz ou texto do tecnico e extraia as informacoes estruturadas.
      Os status possiveis sao: Aberto, Em Andamento, Concluido.
      Sempre responda em portugues brasileiro.`,
    };

    const conteudos: Content[] = [
      { role: "user", parts: [parteSistema] },
      { role: "user", parts: partesDaEntrada },
    ];

    const resultado = await modelo.generateContent({
      contents: conteudos,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const resposta = JSON.parse(resultado.response.text());
    return {
      id_chamado: resposta.ticket_id,
      acao: resposta.action,
      status_alvo: resposta.status_alvo,
      comentario: resposta.comment,
      resposta_assistente: resposta.resposta_assistente,
    };
  },
};
