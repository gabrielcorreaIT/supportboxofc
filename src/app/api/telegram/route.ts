import { NextResponse } from "next/server";
import { IAModel } from "@/models/IAModel";
import {
    getTicketDetailsAction,
    addTicketCommentAction,
    updateTicketStatusAction,
} from "@/controllers/TicketController";

/**
 * ============================================================================
 * 🌐 WEBHOOK: Integração com Telegram
 * ARQUIVO: src/app/api/telegram/route.ts
 * ============================================================================
 * DESCRIÇÃO:
 * Este é o único ponto de entrada para mensagens enviadas pelo Telegram.
 * Ele atua como uma "View Transparente", ou seja, não tem interface gráfica,
 * mas delega todo o trabalho pesado para o Controller e para o IAModel,
 * respeitando estritamente o nosso padrão MVC.
 * ============================================================================
 */
export async function POST(req: Request) {
    try {
        // 1. Recebe e valida o corpo da requisição enviada pelo Telegram
        const body = await req.json();
        const message = body.message;

        // Se não houver mensagem de texto, ignoramos gentilmente
        if (!message || !message.text) {
            return NextResponse.json({ status: "ok" });
        }

        const textoRecebido = message.text;
        const chatId = message.chat.id;

        // 2. Modelo de IA (IAModel): Interpreta a intenção do analista em linguagem natural
        const promptParts = [{ text: textoRecebido }];
        const iaResponse = await IAModel.processTelegramCommand(promptParts);

        // 3. Controlador (TicketController): Executa as ações baseadas na inteligência extraída
        if (iaResponse.ticket_id) {
            // Primeiro, garantimos que o chamado existe no banco
            const ticketResult = await getTicketDetailsAction(iaResponse.ticket_id);

            if (ticketResult.success && ticketResult.data) {
                const ticketUUID = ticketResult.data.id;

                // Ação 1: Atualizar o Status do Chamado
                if (iaResponse.action === "ATUALIZAR_STATUS" && iaResponse.status_alvo) {
                    await updateTicketStatusAction(ticketUUID, iaResponse.status_alvo);
                }

                // Ação 2: Adicionar o Comentário traduzido de forma profissional
                if (iaResponse.comment) {
                    await addTicketCommentAction(
                        ticketUUID,
                        "Equipe de TI (via Telegram)",
                        iaResponse.comment
                    );
                }
            } else {
                // Fallback: Chamado não encontrado
                console.warn(`Chamado ${iaResponse.ticket_id} não encontrado na base.`);
            }
        }

        // 4. Aqui você adicionaria o código (fetch) para a API Oficial do Telegram
        // para devolver a mensagem contida em `iaResponse.resposta_assistente` ao técnico.
        // Exemplo:
        // await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, { ... })

        // O Telegram sempre exige um status 200 (OK) para confirmar que recebemos.
        return NextResponse.json({ status: "sucesso", resposta: iaResponse.resposta_assistente }, { status: 200 });

    } catch (error) {
        console.error("Erro no Webhook do Telegram:", error);
        // Mesmo em falha, não podemos travar o bot do Telegram 
        return NextResponse.json({ status: "falha_interna" }, { status: 500 });
    }
}
