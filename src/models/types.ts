/**
 * ============================================================================
 * [C] CONTROLLER: TicketController (Server Actions)
 * ARQUIVO: src/controllers/TicketController.ts
 * ============================================================================
 * DESCRIÇÃO:
 * Recebe as requisições da View (Frontend),
 * processa validações/regras de negócio e pede ao Model para executar
 * a ação no banco de dados. Roda apenas no servidor (Node.js) graças às Server Actions do Next.js.
 * ============================================================================
 */
"use server"; // Obrigatório: Transforma este arquivo numa fronteira de servidor

import { TicketModel } from "@/models/TicketModel";
import type { Comment } from "@/models/types";

// ============================================================================
// AÇÃO 1: Buscar Detalhes e Histórico (Para a TicketDetailsPage)
// ============================================================================
export async function getTicketDetailsAction(protocol: string) {
  try {
    if (!protocol) {
      return { success: false, error: "Protocolo inválido." };
    }

    // 1. Pede ao Model para buscar o chamado principal
    const ticket = await TicketModel.getByProtocol(protocol);

    if (!ticket) {
      return { success: false, error: "Chamado não encontrado." };
    }

    // 2. Pede ao Model para buscar o histórico de chat daquele chamado
    const comments = await TicketModel.getCommentsByTicketId(ticket.id);

    // 3. Monta o pacote completo para a View não ter trabalho
    const ticketWithInteractions = {
      ...ticket,
      interactions: comments,
    };

    return { success: true, data: ticketWithInteractions };
  } catch (error) {
    console.error("Erro no TicketController (Detalhes):", error);
    return { success: false, error: "Falha interna ao carregar o chamado." };
  }
}

// ============================================================================
// AÇÃO 2: Adicionar novo comentário
// ============================================================================
export async function addTicketCommentAction(
  ticketId: string,
  author: string,
  text: string,
) {
  try {
    // Validação de segurança/negócio básica
    if (!ticketId || !text.trim()) {
      return { success: false, error: "Dados incompletos para o comentário." };
    }

    const newComment: Comment = {
      ticket_id: ticketId,
      author: author,
      text: text.trim(),
      // O created_at será gerado automaticamente pelo Model/Banco
    };

    // Pede ao Model para salvar
    const isSaved = await TicketModel.insertComment(newComment);

    if (!isSaved) {
      return {
        success: false,
        error: "Não foi possível registrar o comentário.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Erro no TicketController (Comentário):", error);
    return { success: false, error: "Falha interna ao enviar a mensagem." };
  }
}
