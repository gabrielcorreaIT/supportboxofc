/**
 * ============================================================================
 * 📦 ARQUIVO: src/app/api/telegram/route.ts
 * 💻 PROJETO: SupportBox
 * 👨‍💻 DESENVOLVEDOR: Gabriel
 * ============================================================================
 * 📝 DESCRIÇÃO:
 * Webhook do Telegram turbinado com Gemini 2.5 Flash.
 * Suporta ÁUDIO, leitura de chamados, atualização de status dinâmica
 * e respostas conversacionais.
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Função para enviar mensagem de texto para o Telegram
async function sendTelegramMessage(chatId: number, text: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "HTML",
        }),
      },
    );
  } catch (error) {
    console.error("Erro ao enviar mensagem Telegram:", error);
  }
}

// Função para baixar o áudio do Telegram e converter para Base64
async function getTelegramAudioBase64(fileId: string): Promise<string | null> {
  if (!TELEGRAM_BOT_TOKEN) return null;
  try {
    const fileRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`,
    );
    const fileData = await fileRes.json();
    if (!fileData.ok) return null;

    const filePath = fileData.result.file_path;
    const audioRes = await fetch(
      `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`,
    );
    const arrayBuffer = await audioRes.arrayBuffer();

    return Buffer.from(arrayBuffer).toString("base64");
  } catch (error) {
    console.error("Erro ao processar áudio do Telegram:", error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message = body.message;
    if (!message) return NextResponse.json({ status: "Ignorado" });

    const chatId = message.chat.id;
    const text = message.text ? message.text.trim() : "";
    const voice = message.voice;

    if (!text && !voice) {
      return NextResponse.json({ status: "Formato não suportado" });
    }

    await sendTelegramMessage(
      chatId,
      "⏳ <i>Analisando a sua solicitação...</i>",
    );

    if (!GEMINI_API_KEY) {
      await sendTelegramMessage(
        chatId,
        "❌ Erro: Chave da IA não configurada.",
      );
      return NextResponse.json({ status: "Erro de API Key" }, { status: 500 });
    }

    // =======================================================================
    // 1. EXTRAÇÃO DE CONTEXTO GLOBAL (A NOVA MÁGICA)
    // =======================================================================
    // Antes de perguntar para a IA, pegamos como está a fila AGORA no banco.
    const allTickets = await db.getTickets();

    // Filtramos apenas os que não estão concluídos para não poluir a IA
    const activeTickets = allTickets.filter(
      (t) => t.status !== "Concluído" && t.status !== "Resolvido",
    );

    let queueContext = "Nenhum chamado pendente no momento. A fila está limpa!";
    if (activeTickets.length > 0) {
      queueContext = activeTickets
        .map(
          (t) =>
            `- ID: ${t.id} | Prioridade: ${t.priority} | Status: ${t.status} | Título: ${t.title}`,
        )
        .join("\n");
    }

    // =======================================================================
    // 2. PREPARAÇÃO DO CÉREBRO DA IA
    // =======================================================================
    const promptParts: any[] = [];

    const systemPrompt = `
      Você é um assistente de TI hiper-inteligente integrado a um sistema de HelpDesk chamado SupportBox.
      Você receberá comandos em TEXTO ou em ÁUDIO.
      O número do chamado sempre tem o formato CH- seguido de 4 números (ex: CH-1234, CH-0012).

      *** CONTEXTO ATUAL DA FILA EM TEMPO REAL ***
      Isto é o que está acontecendo na empresa agora. Use essa lista para responder a dúvidas gerais:
      ${queueContext}
      ********************************************

      AÇÕES PERMITIDAS ("action"):
      - "ATUALIZAR_STATUS": Muda a fase de um chamado específico. "status_alvo" DEVE ser: "Aguardando Atendimento", "Em Andamento" ou "Concluído".
      - "COMENTAR": Adiciona uma nota/recado ao histórico de um chamado.
      - "ATUALIZAR_E_COMENTAR": Altera o status E adiciona um comentário.
      - "CONSULTAR_ESPECIFICO": O técnico quer saber detalhes de UM chamado ESPECÍFICO pelo ID.
      - "DUVIDA_GERAL": O técnico fez uma pergunta livre ou geral (ex: "Tem chamado urgente?", "Quantos chamados abertos?", "Qual é o problema do João?"). Você DEVE ler o CONTEXTO ATUAL fornecido acima e formular uma resposta humana completa no campo "resposta_assistente".
      - "CONVERSAR": O técnico apenas mandou uma saudação (ex: "Oi", "Bom dia").

      Responda APENAS com um objeto JSON válido, neste formato EXATO e mais nada:
      {
        "ticket_id": "CH-XXXX" ou null,
        "action": "ATUALIZAR_STATUS" | "COMENTAR" | "ATUALIZAR_E_COMENTAR" | "CONSULTAR_ESPECIFICO" | "DUVIDA_GERAL" | "CONVERSAR",
        "status_alvo": "Aguardando Atendimento" | "Em Andamento" | "Concluído" | null,
        "comment": "Resumo claro do recado (ou null)",
        "resposta_assistente": "Obrigatório se action for DUVIDA_GERAL ou CONVERSAR. Escreva sua resposta humana e amigável aqui, baseada no contexto se necessário."
      }
    `;

    promptParts.push({ text: systemPrompt });

    if (text) promptParts.push({ text: `Comando do técnico: "${text}"` });

    if (voice) {
      const base64Audio = await getTelegramAudioBase64(voice.file_id);
      if (base64Audio) {
        promptParts.push({
          text: "O técnico enviou o seguinte áudio. Ouça com atenção:",
        });
        promptParts.push({
          inlineData: { data: base64Audio, mimeType: "audio/ogg" },
        });
      }
    }

    // =======================================================================
    // 3. COMUNICAÇÃO COM O GEMINI
    // =======================================================================
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: promptParts }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const aiText = result.response.text();
    let actionData;

    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      actionData = JSON.parse(jsonMatch ? jsonMatch[0] : aiText);
    } catch (parseError) {
      await sendTelegramMessage(
        chatId,
        "⚠️ Erro interno: A IA se confundiu na resposta.",
      );
      return NextResponse.json({ status: "Erro no Parse" });
    }

    const { ticket_id, action, status_alvo, comment, resposta_assistente } =
      actionData;
    const ticketIdClean = ticket_id ? ticket_id.toUpperCase().trim() : null;

    // =======================================================================
    // 4. EXECUÇÃO DAS AÇÕES
    // =======================================================================

    // AÇÃO A: Dúvida Livre baseada no Contexto ou Conversa Comum
    if (action === "DUVIDA_GERAL" || action === "CONVERSAR") {
      const msg =
        resposta_assistente || "Desculpe, não consegui formular uma resposta.";
      await sendTelegramMessage(chatId, `🤖 <b>Assistente:</b>\n${msg}`);
      return NextResponse.json({ status: "Dúvida respondida" });
    }

    // Para as outras ações, exige que o ID exista e esteja limpo
    if (!ticketIdClean) {
      const msg =
        resposta_assistente ||
        "Para fazer isso, por favor me informe o número do chamado (ex: CH-1234).";
      await sendTelegramMessage(chatId, `🤖 <b>Assistente:</b>\n${msg}`);
      return NextResponse.json({ status: "Falta ID" });
    }

    const ticket = await db.getTicketById(ticketIdClean);
    if (!ticket) {
      await sendTelegramMessage(
        chatId,
        `❌ O chamado <b>${ticketIdClean}</b> não foi encontrado na base.`,
      );
      return NextResponse.json({ status: "Ticket não encontrado" });
    }

    // AÇÃO B: Consultar Detalhes Específicos
    if (action === "CONSULTAR_ESPECIFICO") {
      const msg = `🔍 <b>Detalhes do ${ticket.id}</b>\n\n👤 <b>Solicitante:</b> ${ticket.requester}\n📌 <b>Título:</b> ${ticket.title}\n📊 <b>Status:</b> ${ticket.status}\n🚨 <b>Prioridade:</b> ${ticket.priority}\n\n📝 <b>Descrição:</b>\n<i>${ticket.description}</i>`;
      await sendTelegramMessage(chatId, msg);
      return NextResponse.json({ status: "Consulta realizada" });
    }

    // AÇÃO C: Modificar o Banco de Dados
    let responseMessage = `✅ <b>Chamado ${ticketIdClean} atualizado:</b>\n`;

    if (
      (action === "ATUALIZAR_STATUS" || action === "ATUALIZAR_E_COMENTAR") &&
      status_alvo
    ) {
      await db.updateTicketStatus(ticketIdClean, status_alvo);
      responseMessage += `\n🔄 <b>Novo Status:</b> ${status_alvo}`;

      if (!comment || comment.toLowerCase() === "null") {
        await db.addTicketComment(
          ticketIdClean,
          "Assistente Virtual",
          `Status alterado para "${status_alvo}" via Telegram.`,
        );
      }
    }

    if (
      (action === "COMENTAR" || action === "ATUALIZAR_E_COMENTAR") &&
      comment &&
      comment.toLowerCase() !== "null"
    ) {
      await db.addTicketComment(ticketIdClean, "Equipe de TI", comment);
      responseMessage += `\n💬 <b>Comentário registrado:</b> "${comment}"`;
    }

    await sendTelegramMessage(chatId, responseMessage);
    return NextResponse.json({ status: "Sucesso" });
  } catch (error) {
    console.error("Erro fatal no Webhook do Telegram:", error);
    return NextResponse.json(
      { status: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
