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
      "⏳ <i>Analisando e formatando sua mensagem...</i>",
    );

    if (!GEMINI_API_KEY) {
      await sendTelegramMessage(
        chatId,
        "❌ Erro: Chave da IA não configurada.",
      );
      return NextResponse.json({ status: "Erro de API Key" }, { status: 500 });
    }

    // =======================================================================
    // 1. EXTRAÇÃO DE CONTEXTO GLOBAL
    // =======================================================================
    const allTickets = await db.getTickets();
    const activeTickets = allTickets.filter(
      (t) => t.status !== "Concluído" && t.status !== "Resolvido",
    );

    let queueContext = "Nenhum chamado pendente no momento.";
    if (activeTickets.length > 0) {
      queueContext = activeTickets
        .map(
          (t) =>
            `- ID: ${t.id} | Prioridade: ${t.priority} | Status: ${t.status} | Título: ${t.title}`,
        )
        .join("\n");
    }

    // =======================================================================
    // 2. PREPARAÇÃO DO CÉREBRO DA IA (PROMPT COM REFORMULAÇÃO FORMAL)
    // =======================================================================
    const promptParts: any[] = [];

    const systemPrompt = `
      Você é um assistente de TI hiper-inteligente integrado ao SupportBox.
      Você receberá comandos em TEXTO ou ÁUDIO do técnico de suporte.

      *** REGRAS CRÍTICAS DE REFORMULAÇÃO (CAMPO "comment") ***
      - O técnico muitas vezes fala de forma rápida, informal ou usa gírias (ex: "avisa o cara que o pc morreu").
      - Você deve SEMPRE reformular o conteúdo para uma linguagem FORMAL, PROFISSIONAL e TÉCNICA.
      - Exemplo: "Troquei o mouse quebrado" -> "Realizada a substituição do periférico (mouse) por apresentar defeito físico. Testes concluídos com sucesso."
      - Exemplo: "O sistema tá lento mas já arrumei" -> "Efetuada análise de desempenho no sistema. Foram aplicadas correções de otimização, restabelecendo a performance habitual."
      - NUNCA use gírias ou primeira pessoa informal no campo "comment".

      *** CONTEXTO ATUAL DA FILA ***
      ${queueContext}

      AÇÕES PERMITIDAS ("action"):
      - "ATUALIZAR_STATUS": Muda a fase (status_alvo: "Aguardando Atendimento", "Em Andamento" ou "Concluído").
      - "COMENTAR": Apenas adiciona uma nota formal.
      - "ATUALIZAR_E_COMENTAR": Altera status e adiciona nota formal.
      - "CONSULTAR_ESPECIFICO": Detalhes de um ID.
      - "DUVIDA_GERAL": Perguntas sobre a fila.
      - "CONVERSAR": Saudação.

      Responda APENAS com um objeto JSON válido:
      {
        "ticket_id": "CH-XXXX" ou null,
        "action": "...",
        "status_alvo": "...",
        "comment": "REFORMULAÇÃO FORMAL E TÉCNICA DA FALA DO TÉCNICO",
        "resposta_assistente": "Resposta amigável para o técnico no Telegram confirmando a ação."
      }
    `;

    promptParts.push({ text: systemPrompt });

    if (text) promptParts.push({ text: `Entrada do técnico: "${text}"` });

    if (voice) {
      const base64Audio = await getTelegramAudioBase64(voice.file_id);
      if (base64Audio) {
        promptParts.push({
          text: "Entrada via áudio do técnico para processamento:",
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
        "⚠️ Erro interno na formatação dos dados.",
      );
      return NextResponse.json({ status: "Erro no Parse" });
    }

    const { ticket_id, action, status_alvo, comment, resposta_assistente } =
      actionData;
    const ticketIdClean = ticket_id ? ticket_id.toUpperCase().trim() : null;

    // AÇÃO A: Dúvida ou Conversa
    if (action === "DUVIDA_GERAL" || action === "CONVERSAR") {
      await sendTelegramMessage(
        chatId,
        `🤖 <b>Assistente:</b>\n${resposta_assistente}`,
      );
      return NextResponse.json({ status: "Respondido" });
    }

    if (!ticketIdClean) {
      await sendTelegramMessage(
        chatId,
        `🤖 <b>Assistente:</b>\n${resposta_assistente || "Por favor, informe o número do chamado."}`,
      );
      return NextResponse.json({ status: "Falta ID" });
    }

    const ticket = await db.getTicketById(ticketIdClean);
    if (!ticket) {
      await sendTelegramMessage(
        chatId,
        `❌ Chamado <b>${ticketIdClean}</b> não encontrado.`,
      );
      return NextResponse.json({ status: "Não encontrado" });
    }

    // AÇÃO B: Consultar
    if (action === "CONSULTAR_ESPECIFICO") {
      const msg = `🔍 <b>Detalhes do ${ticket.id}</b>\n\n👤 <b>Solicitante:</b> ${ticket.requester}\n📊 <b>Status:</b> ${ticket.status}\n🚨 <b>Prioridade:</b> ${ticket.priority}\n\n📝 <b>Descrição:</b>\n<i>${ticket.description}</i>`;
      await sendTelegramMessage(chatId, msg);
      return NextResponse.json({ status: "Consultado" });
    }

    // AÇÃO C: Modificar Banco
    let responseMessage = `✅ <b>Chamado ${ticketIdClean} atualizado:</b>\n`;

    if (
      (action === "ATUALIZAR_STATUS" || action === "ATUALIZAR_E_COMENTAR") &&
      status_alvo
    ) {
      await db.updateTicketStatus(ticketIdClean, status_alvo);
      responseMessage += `\n🔄 <b>Status:</b> ${status_alvo}`;

      if (!comment || comment.toLowerCase() === "null") {
        await db.addTicketComment(
          ticketIdClean,
          "Assistente Virtual",
          `O status do chamado foi alterado para "${status_alvo}".`,
        );
      }
    }

    if (
      (action === "COMENTAR" || action === "ATUALIZAR_E_COMENTAR") &&
      comment &&
      comment.toLowerCase() !== "null"
    ) {
      await db.addTicketComment(ticketIdClean, "Equipe de TI", comment);
      responseMessage += `\n💬 <b>Registro Formal:</b>\n"<i>${comment}</i>"`;
    }

    await sendTelegramMessage(chatId, responseMessage);
    return NextResponse.json({ status: "Sucesso" });
  } catch (error) {
    console.error("Erro fatal no Webhook:", error);
    return NextResponse.json({ status: "Erro interno" }, { status: 500 });
  }
}
