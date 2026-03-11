/**
 * ============================================================================
 * 📦 ARQUIVO: src/app/api/telegram/route.ts
 * 💻 PROJETO: SupportBox
 * 👨‍💻 DESENVOLVEDOR: Gabriel
 * 🏢 CONTEXTO: Sistema de comunicação entre um setor de TI e seus solicitantes.
 * ============================================================================
 * 📝 DESCRIÇÃO:
 * Este arquivo é a API Route (Webhook) do Telegram. Utiliza o Gemini para
 * compreender linguagem natural. O técnico pode digitar comandos complexos
 * e a IA extrai a intenção, o protocolo e o contexto, salvando tudo
 * estruturado no Supabase (mudança de status e histórico de mensagens).
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Função utilitária para enviar mensagens de volta para o chat do Telegram
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
    console.error("Erro ao enviar mensagem para o Telegram:", error);
  }
}

export async function POST(req: Request) {
  try {
    // 1. Tenta extrair o corpo da requisição do Telegram
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { status: "Corpo da requisição inválido" },
        { status: 400 },
      );
    }

    // 2. Verifica se é uma mensagem de texto normal
    if (!body?.message?.text) {
      return NextResponse.json({ status: "Ignorado - Não é texto" });
    }

    const chatId = body.message.chat.id;
    const text = body.message.text.trim();

    // Envia feedback de carregamento
    await sendTelegramMessage(chatId, "⏳ <i>Analisando a sua mensagem...</i>");

    if (!GEMINI_API_KEY) {
      await sendTelegramMessage(
        chatId,
        "❌ Erro: Chave da IA não configurada no servidor (.env).",
      );
      return NextResponse.json({ status: "Erro de API Key" }, { status: 500 });
    }

    // =======================================================================
    // 3. PROCESSAMENTO COM IA (GEMINI)
    // =======================================================================
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `
      Você é um assistente de TI integrado a um sistema de HelpDesk.
      A sua função é ler a mensagem do técnico, entender a intenção dele e extrair dados para o sistema.
      O número do chamado sempre tem o formato CH- seguido de 4 números (ex: CH-1234, CH-0012).
      
      Regras de Classificação de Ação (action):
      - Se o técnico quer APENAS fechar/resolver, retorne "RESOLVER".
      - Se o técnico dá uma explicação/mensagem para o usuário E manda fechar o chamado, retorne "RESOLVER_E_COMENTAR".
      - Se o técnico APENAS responde ao usuário sem mandar fechar, retorne "COMENTAR".
      
      Mensagem do técnico: "${text}"

      Responda APENAS com um objeto JSON válido, sem texto antes ou depois. Use este formato exato:
      {
        "ticket_id": "CH-XXXX",
        "action": "AÇÃO_AQUI",
        "comment": "Resumo claro e profissional da explicação do técnico (use null se não houver recado)"
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const aiText = result.response.text();
    let actionData;

    // 4. EXTRAÇÃO BLINDADA DO JSON
    // Usa Regex para encontrar o conteúdo entre chaves { }, ignorando formatações markdown do Gemini
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        actionData = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error("Erro ao fazer parse do JSON da IA:", parseError, aiText);
        await sendTelegramMessage(
          chatId,
          "⚠️ Erro interno: A IA não retornou um formato de dados válido.",
        );
        return NextResponse.json({ status: "Erro no Parse da IA" });
      }
    } else {
      await sendTelegramMessage(
        chatId,
        "⚠️ Erro interno: A IA não retornou um formato JSON.",
      );
      return NextResponse.json({ status: "JSON não encontrado" });
    }

    // =======================================================================
    // 5. EXECUÇÃO DA AÇÃO NO BANCO DE DADOS (SUPABASE)
    // =======================================================================

    // Garante que o ticket_id está em maiúsculo (CH-1234) e limpa espaços
    const ticket_id = actionData.ticket_id
      ? actionData.ticket_id.toUpperCase().trim()
      : null;
    const action = actionData.action;
    const comment = actionData.comment;

    // Validação inicial
    if (!ticket_id || ticket_id === "NULL" || action === "NENHUMA") {
      await sendTelegramMessage(
        chatId,
        "⚠️ Não consegui identificar um número de chamado válido (ex: CH-1234) ou uma ação clara na sua mensagem.\n\nTente algo como: <i>'Pode fechar o chamado CH-1234, o problema era o cabo.'</i>",
      );
      return NextResponse.json({ status: "Ação/Ticket não identificados" });
    }

    // Verifica se o chamado existe no banco
    const ticket = await db.getTicketById(ticket_id);
    if (!ticket) {
      await sendTelegramMessage(
        chatId,
        `❌ O chamado <b>${ticket_id}</b> não existe na nossa base de dados.`,
      );
      return NextResponse.json({ status: "Ticket não encontrado" });
    }

    let responseMessage = `✅ <b>Protocolo ${ticket_id} atualizado com sucesso:</b>\n`;

    // AÇÃO A: Adicionar Comentário
    if (
      (action === "COMENTAR" || action === "RESOLVER_E_COMENTAR") &&
      comment &&
      comment.toLowerCase() !== "null"
    ) {
      const commentSuccess = await db.addTicketComment(
        ticket_id,
        "Equipe de TI",
        comment,
      );
      if (commentSuccess) {
        responseMessage += `\n💬 <b>Comentário salvo:</b> "${comment}"`;
      } else {
        responseMessage += `\n⚠️ <b>Aviso:</b> Falha ao salvar o comentário no banco de dados.`;
      }
    }

    // AÇÃO B: Mudar status para Resolvido
    if (action === "RESOLVER" || action === "RESOLVER_E_COMENTAR") {
      await db.updateTicketStatus(ticket_id, "Concluído");
      responseMessage += `\n🔒 <b>Status:</b> Alterado para Concluído.`;

      // Se ele mandou apenas resolver sem explicar nada, registramos no histórico para não ficar em branco
      if (
        action === "RESOLVER" &&
        (!comment || comment.toLowerCase() === "null")
      ) {
        await db.addTicketComment(
          ticket_id,
          "Sistema Automático",
          "O chamado foi marcado como Concluído pela Equipe de TI via Telegram.",
        );
      }
    }

    // 6. Confirmação final para o técnico
    await sendTelegramMessage(chatId, responseMessage);

    return NextResponse.json({ status: "Processado com IA com sucesso" });
  } catch (error) {
    console.error("Erro fatal no Webhook do Telegram:", error);
    return NextResponse.json(
      { status: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
