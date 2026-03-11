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

// Função para baixar o áudio do Telegram e converter para Base64 (Para o Gemini ouvir)
async function getTelegramAudioBase64(fileId: string): Promise<string | null> {
  if (!TELEGRAM_BOT_TOKEN) return null;
  try {
    // 1. Pega o caminho do arquivo no servidor do Telegram
    const fileRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`,
    );
    const fileData = await fileRes.json();
    if (!fileData.ok) return null;

    // 2. Baixa o arquivo de áudio (.ogg)
    const filePath = fileData.result.file_path;
    const audioRes = await fetch(
      `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`,
    );
    const arrayBuffer = await audioRes.arrayBuffer();

    // 3. Converte para base64
    return Buffer.from(arrayBuffer).toString("base64");
  } catch (error) {
    console.error("Erro ao processar áudio do Telegram:", error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Extrai os dados essenciais
    const message = body.message;
    if (!message) return NextResponse.json({ status: "Ignorado" });

    const chatId = message.chat.id;
    const text = message.text ? message.text.trim() : "";
    const voice = message.voice; // Mensagem de Áudio

    // Se não tiver texto nem áudio, ignora.
    if (!text && !voice) {
      return NextResponse.json({ status: "Formato não suportado" });
    }

    // Feedback instantâneo para o técnico saber que o bot está "pensando"
    await sendTelegramMessage(chatId, "⏳ <i>Analisando o seu comando...</i>");

    if (!GEMINI_API_KEY) {
      await sendTelegramMessage(
        chatId,
        "❌ Erro: Chave da IA não configurada.",
      );
      return NextResponse.json({ status: "Erro de API Key" }, { status: 500 });
    }

    // =======================================================================
    // PREPARAÇÃO DOS DADOS PARA A IA OUVIR/LER
    // =======================================================================
    const promptParts: any[] = [];

    const systemPrompt = `
      Você é um assistente de TI hiper-inteligente integrado a um sistema de HelpDesk chamado SupportBox.
      Você receberá comandos em TEXTO ou em ÁUDIO (transcreva o áudio mentalmente).
      O número do chamado sempre tem o formato CH- seguido de 4 números (ex: CH-1234, CH-0012).

      AÇÕES PERMITIDAS ("action"):
      - "ATUALIZAR_STATUS": Muda a fase do chamado. O "status_alvo" DEVE ser: "Aguardando Atendimento", "Em Andamento" ou "Concluído".
      - "COMENTAR": Apenas adiciona uma nota/recado ao histórico do chamado.
      - "ATUALIZAR_E_COMENTAR": Altera o status E adiciona um comentário.
      - "CONSULTAR": O técnico quer saber detalhes ou o status atual de um chamado específico.
      - "CONVERSAR": O técnico não falou de nenhum chamado específico (ex: disse apenas "Oi", "Tudo bem?", ou o número não foi informado).

      Responda APENAS com um objeto JSON válido, neste formato EXATO e mais nada:
      {
        "ticket_id": "CH-XXXX" ou null,
        "action": "ATUALIZAR_STATUS" | "COMENTAR" | "ATUALIZAR_E_COMENTAR" | "CONSULTAR" | "CONVERSAR",
        "status_alvo": "Aguardando Atendimento" | "Em Andamento" | "Concluído" | null,
        "comment": "Resumo claro e profissional do recado/comentário (ou null)",
        "resposta_assistente": "Se a action for CONVERSAR ou se faltar o ID do chamado, escreva aqui uma resposta simpática pedindo o número do chamado. Se for CONSULTAR, pode ser null."
      }
    `;

    promptParts.push({ text: systemPrompt });

    if (text) {
      promptParts.push({ text: `Comando do técnico: "${text}"` });
    }

    // Se for áudio, baixa e anexa para o Gemini "ouvir"
    if (voice) {
      const base64Audio = await getTelegramAudioBase64(voice.file_id);
      if (base64Audio) {
        promptParts.push({
          text: "O técnico enviou o seguinte áudio. Ouça com atenção:",
        });
        promptParts.push({
          inlineData: { data: base64Audio, mimeType: "audio/ogg" },
        });
      } else {
        await sendTelegramMessage(
          chatId,
          "⚠️ Desculpe, não consegui fazer o download do seu áudio.",
        );
        return NextResponse.json({ status: "Erro de áudio" });
      }
    }

    // =======================================================================
    // PROCESSAMENTO COM IA (GEMINI 2.5 FLASH)
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
        "⚠️ Erro interno: A IA não formatou os dados corretamente.",
      );
      return NextResponse.json({ status: "Erro no Parse" });
    }

    // =======================================================================
    // EXECUÇÃO DA AÇÃO E BANCO DE DADOS (SUPABASE)
    // =======================================================================
    const { ticket_id, action, status_alvo, comment, resposta_assistente } =
      actionData;
    const ticketIdClean = ticket_id ? ticket_id.toUpperCase().trim() : null;

    // AÇÃO 1: CONVERSAR (Bate-papo normal ou faltando dados)
    if (action === "CONVERSAR" || !ticketIdClean) {
      const msg =
        resposta_assistente ||
        "Olá! Por favor, me informe o número do chamado (ex: CH-1234) e o que deseja fazer.";
      await sendTelegramMessage(chatId, `🤖 <b>Assistente:</b>\n${msg}`);
      return NextResponse.json({ status: "Conversa respondida" });
    }

    // Validação de Existência do Chamado
    const ticket = await db.getTicketById(ticketIdClean);
    if (!ticket) {
      await sendTelegramMessage(
        chatId,
        `❌ O chamado <b>${ticketIdClean}</b> não foi encontrado no SupportBox.`,
      );
      return NextResponse.json({ status: "Ticket não encontrado" });
    }

    // AÇÃO 2: CONSULTAR (Ler o chamado para o Técnico)
    if (action === "CONSULTAR") {
      const msg = `🔍 <b>Detalhes do Chamado ${ticket.id}</b>\n\n👤 <b>Solicitante:</b> ${ticket.requester}\n📌 <b>Título:</b> ${ticket.title}\n📊 <b>Status:</b> ${ticket.status}\n🚨 <b>Prioridade:</b> ${ticket.priority}\n\n📝 <b>Descrição original:</b>\n<i>${ticket.description}</i>`;
      await sendTelegramMessage(chatId, msg);
      return NextResponse.json({ status: "Consulta realizada" });
    }

    // AÇÕES 3, 4 e 5: MODIFICAR O BANCO DE DADOS
    let responseMessage = `✅ <b>Chamado ${ticketIdClean} atualizado:</b>\n`;

    // Alterar Status
    if (
      (action === "ATUALIZAR_STATUS" || action === "ATUALIZAR_E_COMENTAR") &&
      status_alvo
    ) {
      await db.updateTicketStatus(ticketIdClean, status_alvo);
      responseMessage += `\n🔄 <b>Novo Status:</b> ${status_alvo}`;

      // Se não houver comentário manual, gera um automático no histórico
      if (!comment || comment.toLowerCase() === "null") {
        await db.addTicketComment(
          ticketIdClean,
          "Assistente Virtual",
          `Status alterado para "${status_alvo}" via Telegram.`,
        );
      }
    }

    // Adicionar Comentário
    if (
      (action === "COMENTAR" || action === "ATUALIZAR_E_COMENTAR") &&
      comment &&
      comment.toLowerCase() !== "null"
    ) {
      await db.addTicketComment(ticketIdClean, "Equipe de TI", comment);
      responseMessage += `\n💬 <b>Comentário registrado:</b> "${comment}"`;
    }

    // Confirmação final para o Telegram
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
