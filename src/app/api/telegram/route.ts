/**
 * CAMADA: Infraestrutura (API Route)
 * ARQUIVO: src/app/api/telegram/route.ts
 *
 * DESCRICAO:
 *   Webhook que recebe mensagens do bot Telegram. Este arquivo cuida
 *   apenas da camada HTTP: valida a requisicao, extrai o conteudo
 *   da mensagem (texto ou audio) e delega toda a logica de negocio
 *   ao TelegramController.
 *
 * CONEXOES:
 *   - Depende de: TelegramController (processa a mensagem e executa acoes)
 *   - Chamado por: Telegram Bot API (via webhook configurado)
 *
 * FLUXO:
 *   Telegram envia POST -> valida seguranca -> extrai conteudo -> TelegramController
 */
import { NextRequest, NextResponse } from "next/server";
import type { Part } from "@google/generative-ai";
import { acaoProcessarMensagemTelegram } from "@/controllers/TelegramController";

/* ------------------------------------------------------------------ */
/*  Configuracao do Telegram (variaveis de ambiente)                  */
/* ------------------------------------------------------------------ */

const TOKEN_TELEGRAM = process.env.TELEGRAM_BOT_TOKEN;
const API_TELEGRAM = `https://api.telegram.org/bot${TOKEN_TELEGRAM}`;
const SEGREDO_WEBHOOK = process.env.TELEGRAM_WEBHOOK_SECRET;

/** Limite de 10 MB para arquivos de audio recebidos */
const MAX_BYTES_AUDIO = 10 * 1024 * 1024;

/* ------------------------------------------------------------------ */
/*  Funcoes auxiliares de comunicacao com a API do Telegram            */
/* ------------------------------------------------------------------ */

/** Envia uma mensagem de texto para um chat do Telegram. */
async function enviarMensagem(chatId: number, texto: string): Promise<void> {
  await fetch(`${API_TELEGRAM}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: texto, parse_mode: "Markdown" }),
  });
}

/** Baixa um arquivo do Telegram e retorna seu conteudo em base64. */
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

/* ------------------------------------------------------------------ */
/*  Handler principal do webhook (POST)                               */
/* ------------------------------------------------------------------ */

export async function POST(requisicao: NextRequest): Promise<NextResponse> {
  if (!TOKEN_TELEGRAM) {
    console.error("TELEGRAM_BOT_TOKEN nao configurado.");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // Valida o secret token enviado pelo Telegram para garantir autenticidade
  if (SEGREDO_WEBHOOK) {
    const segredoRecebido = requisicao.headers.get("x-telegram-bot-api-secret-token");
    if (!segredoRecebido || segredoRecebido !== SEGREDO_WEBHOOK) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
  }

  // Faz o parse do corpo da requisicao
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
    // Extrai o conteudo da mensagem no formato que a IA espera
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

    // Delega toda a logica de negocio ao Controller
    const nomeTecnico = mensagem.from?.first_name ?? "Tecnico via Telegram";
    const resultado = await acaoProcessarMensagemTelegram(partesEntrada, nomeTecnico);

    await enviarMensagem(chatId, resultado.textoResposta);
  } catch (error) {
    console.error("Erro no webhook Telegram:", error);
    await enviarMensagem(chatId, "Erro interno ao processar seu comando. Tente novamente.");
  }

  return NextResponse.json({ ok: true });
}

/* ------------------------------------------------------------------ */
/*  Tipos da API do Telegram (usados apenas neste arquivo)            */
/* ------------------------------------------------------------------ */

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
