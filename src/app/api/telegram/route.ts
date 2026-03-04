/**
 * ============================================================================
 * ARQUIVO: src/app/api/telegram/route.ts
 * PROJETO: SupportBox
 * AUTOR: Gabriel
 * CONTEXTO: Projeto de Engenharia de Software
 * ============================================================================
 * DESCRIÇÃO:
 * Este arquivo atua como o Webhook de integração entre a aplicação Next.js e
 * a API do Telegram. Ele é responsável por escutar e processar os comandos
 * enviados ao bot.
 *
 * REGRA DE NEGÓCIO PRINCIPAL:
 * O SupportBox gerencia a comunicação interna entre um setor de TI e seus
 * solicitantes que abrem chamados. Este endpoint fornece aos técnicos de TI
 * a facilidade de alterar o status de um chamado para "Concluído" interagindo
 * apenas com o bot do Telegram, sincronizando a ação em tempo real com o
 * banco de dados Supabase e o painel web.
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

// Token de segurança do bot do Telegram armazenado nas variáveis de ambiente
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/**
 * Rota HTTP POST principal acionada automaticamente pelo Telegram.
 */
export async function POST(req: Request) {
  try {
    // 1. Extração do payload enviado pelo Telegram
    const body = await req.json();

    // 2. Validação básica de estrutura da mensagem
    if (body.message && body.message.text) {
      const chatId = body.message.chat.id; // ID da conversa para enviar a resposta
      const text = body.message.text; // Conteúdo digitado pelo técnico

      // 3. Interceptação do comando de resolução
      if (text.startsWith("/resolver")) {
        // Separa o comando do ID do chamado (Ex: "/resolver CH-468" -> "CH-468")
        const ticketId = text.split(" ")[1];

        if (ticketId) {
          // ==================================================================
          // FLUXO 1: CAMINHO FELIZ (Comando acompanhado de um ID de chamado)
          // ==================================================================

          // Atualiza o status do chamado aberto pelo solicitante no banco de dados
          await db.updateTicketStatus(ticketId, "Concluído");

          // Prepara o feedback positivo para o técnico do setor de TI
          const mensagemResposta = `✅ Sucesso! O chamado ${ticketId} foi resolvido pelo setor de TI.`;

          // Dispara a confirmação via API do Telegram
          await fetch(
            `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: chatId,
                text: mensagemResposta,
              }),
            },
          );
        } else {
          // ==================================================================
          // FLUXO 2: CAMINHO TRISTE (Comando sem ID do chamado)
          // ==================================================================

          // Prepara uma mensagem educativa instruindo o formato correto
          const mensagemErro = `⚠️ Ops! Faltou o ID do chamado.\n\nPara que o setor de TI resolva um ticket, digite o comando acompanhado do ID.\nExemplo: /resolver CH-468`;

          // Retorna o aviso de erro de sintaxe para o técnico
          await fetch(
            `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: chatId,
                text: mensagemErro,
              }),
            },
          );
        }
      }
    }

    // 4. Retorno obrigatório de Sucesso (Status 200) para o Telegram
    // Evita que o Telegram considere a entrega como falha e crie um loop de reenvio
    return NextResponse.json(
      { message: "Webhook processado com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    // 5. Tratamento de exceções gerais do servidor
    console.error(
      "Erro interno no processamento do Webhook do Telegram:",
      error,
    );
    return NextResponse.json(
      { error: "Erro interno no servidor do SupportBox" },
      { status: 500 },
    );
  }
}
