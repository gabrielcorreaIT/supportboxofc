/**
 * [C] API ROUTE: Webhook do Telegram
 * ARQUIVO: src/app/api/telegram/route.ts
 *
 * Recebe atualizacoes do bot Telegram (texto e audio dos tecnicos em campo).
 * Delega interpretacao ao IAModel e executa acoes via TicketController.
 */
import { NextRequest, NextResponse } from "next/server";
import type { Part } from "@google/generative-ai";
import { IAModel } from "@/models/IAModel";
import {
  acaoObterDetalhesChamado,
  acaoAdicionarComentario,
  acaoAtualizarStatus,
} from "@/controllers/TicketController";

const TOKEN_TELEGRAM = process.env.TELEGRAM_BOT_TOKEN;
const API_TELEGRAM = `https://api.telegram.org/bot${TOKEN_TELEGRAM}`;
const SEGREDO_WEBHOOK = process.env.TELEGRAM_WEBHOOK_SECRET;
const MAX_BYTES_AUDIO = 10 * 1024 * 1024;

async function enviarMensagem(chatId: number, texto: string): Promise<void> {
  await fetch(`${API_TELEGRAM}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: texto, parse_mode: "Markdown" }),
  });
}

async function baixarArquivoBase64(fileId: string): Promise<string> {
  const res = await fetch(`${API_TELEGRAM}/getFile?file_id=${fileId}`);
  const dados = (await res.json()) as {
    result: { file_path: string; file_size?: number };
  };

  if (dados.result.file_size && dados.result.file_size > MAX_BYTES_AUDIO) {
    throw new Error("Arquivo de audio excede 10 MB.");
  }

  const resAudio = await fetch(
    `https://api.telegram.org/file/bot${TOKEN_TELEGRAM}/${dados.result.file_path}`,
  );
  const arrayBuffer = await resAudio.arrayBuffer();

  if (arrayBuffer.byteLength > MAX_BYTES_AUDIO) {
    throw new Error("Arquivo de audio excede 10 MB.");
  }

  return Buffer.from(arrayBuffer).toString("base64");
}

export async function POST(requisicao: NextRequest): Promise<NextResponse> {
  if (!TOKEN_TELEGRAM) {
    console.error("TELEGRAM_BOT_TOKEN nao configurado.");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // Validacao do secret token do webhook
  if (SEGREDO_WEBHOOK) {
    const segredoRecebido = requisicao.headers.get("x-telegram-bot-api-secret-token");
    if (!segredoRecebido || segredoRecebido !== SEGREDO_WEBHOOK) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
  }

  let atualizacao: AtualizacaoTelegram;
  try {
    atualizacao = (await requisicao.json()) as AtualizacaoTelegram;
  } catch {
    return NextResponse.json({ ok: false, error: "Payload invalido" }, { status: 400 });
  }

  const mensagem = atualizacao.message;
  if (!mensagem) return NextResponse.json({ ok: true });

  const chatId = mensagem.chat.id;

  try {
    const partesEntrada: Part[] = [];

    if (mensagem.text) {
      partesEntrada.push({ text: mensagem.text });
    } else if (mensagem.voice) {
      const audioBase64 = await baixarArquivoBase64(mensagem.voice.file_id);
      partesEntrada.push({ inlineData: { mimeType: "audio/ogg", data: audioBase64 } });
      partesEntrada.push({
        text: "Interprete o audio acima como um comando de um tecnico de TI sobre chamados do SupportBox.",
      });
    } else {
      await enviarMensagem(chatId, "Por enquanto so processo *texto* ou *mensagens de voz*.");
      return NextResponse.json({ ok: true });
    }

    const comando = await IAModel.processarComandoTelegram(partesEntrada);

    if (comando.acao === "ATUALIZAR_STATUS" && comando.id_chamado && comando.status_alvo) {
      const resultadoChamado = await acaoObterDetalhesChamado(comando.id_chamado);
      if (!resultadoChamado.sucesso || !resultadoChamado.dados) {
        await enviarMensagem(chatId, `Chamado *${comando.id_chamado}* nao encontrado.`);
        return NextResponse.json({ ok: true });
      }
      await acaoAtualizarStatus(resultadoChamado.dados.id, comando.status_alvo);
      if (comando.comentario) {
        await acaoAdicionarComentario(
          resultadoChamado.dados.id,
          mensagem.from?.first_name ?? "Tecnico via Telegram",
          comando.comentario,
        );
      }
      await enviarMensagem(chatId, comando.resposta_assistente);
    } else if (comando.acao === "COMENTAR" && comando.id_chamado && comando.comentario) {
      const resultadoChamado = await acaoObterDetalhesChamado(comando.id_chamado);
      if (!resultadoChamado.sucesso || !resultadoChamado.dados) {
        await enviarMensagem(chatId, `Chamado *${comando.id_chamado}* nao encontrado.`);
        return NextResponse.json({ ok: true });
      }
      await acaoAdicionarComentario(
        resultadoChamado.dados.id,
        mensagem.from?.first_name ?? "Tecnico via Telegram",
        comando.comentario,
      );
      await enviarMensagem(chatId, comando.resposta_assistente);
    } else {
      await enviarMensagem(chatId, comando.resposta_assistente);
    }
  } catch (error) {
    console.error("Erro no webhook Telegram:", error);
    await enviarMensagem(chatId, "Erro interno ao processar seu comando. Tente novamente.");
  }

  return NextResponse.json({ ok: true });
}

// Tipos locais do Telegram
interface AtualizacaoTelegram {
  update_id: number;
  message?: MensagemTelegram;
}

interface MensagemTelegram {
  message_id: number;
  from?: { id: number; first_name: string; username?: string };
  chat: { id: number; type: string };
  text?: string;
  voice?: { file_id: string; file_size?: number; duration: number; mime_type: string };
}
