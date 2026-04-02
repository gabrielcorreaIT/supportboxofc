/**
 * [C] API ROUTE: Telegram Webhook
 * ARQUIVO: src/app/api/telegram/route.ts
 *
 * Recebe atualizacoes do bot Telegram (texto e audio dos tecnicos em campo).
 * Delega interpretacao ao IAModel e executa acoes via TicketController.
 */
import { NextRequest, NextResponse } from "next/server";
import type { Part } from "@google/generative-ai";
import { IAModel } from "@/models/IAModel";
import {
  getTicketDetailsAction,
  addTicketCommentAction,
  updateTicketStatusAction,
} from "@/controllers/TicketController";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const TELEGRAM_WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

async function sendMessage(chatId: number, text: string): Promise<void> {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  });
}

async function downloadFileAsBase64(fileId: string): Promise<string> {
  const res = await fetch(`${TELEGRAM_API}/getFile?file_id=${fileId}`);
  const data = (await res.json()) as {
    result: { file_path: string; file_size?: number };
  };

  if (data.result.file_size && data.result.file_size > MAX_AUDIO_BYTES) {
    throw new Error("Arquivo de audio excede 10 MB.");
  }

  const audioRes = await fetch(
    `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${data.result.file_path}`,
  );
  const arrayBuffer = await audioRes.arrayBuffer();

  if (arrayBuffer.byteLength > MAX_AUDIO_BYTES) {
    throw new Error("Arquivo de audio excede 10 MB.");
  }

  return Buffer.from(arrayBuffer).toString("base64");
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!TELEGRAM_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN nao configurado.");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // Validacao do secret token do webhook
  if (TELEGRAM_WEBHOOK_SECRET) {
    const incomingSecret = request.headers.get("x-telegram-bot-api-secret-token");
    if (!incomingSecret || incomingSecret !== TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
  }

  let update: TelegramUpdate;
  try {
    update = (await request.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: false, error: "Payload invalido" }, { status: 400 });
  }

  const message = update.message;
  if (!message) return NextResponse.json({ ok: true });

  const chatId = message.chat.id;

  try {
    const promptParts: Part[] = [];

    if (message.text) {
      promptParts.push({ text: message.text });
    } else if (message.voice) {
      const audioBase64 = await downloadFileAsBase64(message.voice.file_id);
      promptParts.push({ inlineData: { mimeType: "audio/ogg", data: audioBase64 } });
      promptParts.push({
        text: "Interprete o audio acima como um comando de um tecnico de TI sobre chamados do SupportBox.",
      });
    } else {
      await sendMessage(chatId, "Por enquanto so processo *texto* ou *mensagens de voz*.");
      return NextResponse.json({ ok: true });
    }

    const command = await IAModel.processTelegramCommand(promptParts);

    if (command.action === "ATUALIZAR_STATUS" && command.ticket_id && command.status_alvo) {
      const ticketResult = await getTicketDetailsAction(command.ticket_id);
      if (!ticketResult.success || !ticketResult.data) {
        await sendMessage(chatId, `Chamado *${command.ticket_id}* nao encontrado.`);
        return NextResponse.json({ ok: true });
      }
      await updateTicketStatusAction(ticketResult.data.id, command.status_alvo);
      if (command.comment) {
        await addTicketCommentAction(
          ticketResult.data.id,
          message.from?.first_name ?? "Tecnico via Telegram",
          command.comment,
        );
      }
      await sendMessage(chatId, command.resposta_assistente);
    } else if (command.action === "COMENTAR" && command.ticket_id && command.comment) {
      const ticketResult = await getTicketDetailsAction(command.ticket_id);
      if (!ticketResult.success || !ticketResult.data) {
        await sendMessage(chatId, `Chamado *${command.ticket_id}* nao encontrado.`);
        return NextResponse.json({ ok: true });
      }
      await addTicketCommentAction(
        ticketResult.data.id,
        message.from?.first_name ?? "Tecnico via Telegram",
        command.comment,
      );
      await sendMessage(chatId, command.resposta_assistente);
    } else {
      await sendMessage(chatId, command.resposta_assistente);
    }
  } catch (error) {
    console.error("Erro no webhook Telegram:", error);
    await sendMessage(chatId, "Erro interno ao processar seu comando. Tente novamente.");
  }

  return NextResponse.json({ ok: true });
}

// Tipos locais do Telegram
interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

interface TelegramMessage {
  message_id: number;
  from?: { id: number; first_name: string; username?: string };
  chat: { id: number; type: string };
  text?: string;
  voice?: { file_id: string; file_size?: number; duration: number; mime_type: string };
}
