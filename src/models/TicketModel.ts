/**
 * ============================================================================
 * [M] MODEL: TicketModel
 * ARQUIVO: src/models/TicketModel.ts
 * ============================================================================
 * DESCRIÇÃO:
 * Responsável EXCLUSIVO por interagir com a tabela de chamados e
 * comentários no Supabase.
 * Não possui regras de negócio (isso é papel do Controller).
 * Retorna os dados puros mapeados para as interfaces do nosso domínio.
 * ============================================================================
 */
import { supabase } from "@/lib/supabase";
import type { Ticket, Comment } from "./types";

export const TicketModel = {
  // =========================================================================
  // CHAMADOS (TICKETS)
  // =========================================================================

  async getByProtocol(ticketNumber: string): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      // Busca pelo protocolo legível (ex: CH-0014) que vem da URL
      .eq("ticket_number", ticketNumber)
      .single();

    if (error || !data) {
      console.error(`Falha ao buscar chamado ${ticketNumber}:`, error?.message);
      return null;
    }
    return data as Ticket;
  },

  async getAllActiveTickets() {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("status", "Aguardando Atendimento")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Falha ao buscar chamados ativos:", error.message);
      return [];
    }
    return data as Ticket[];
  },

  async getTicketById(id: string): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error(`Falha ao buscar chamado por ID ${id}:`, error?.message);
      return null;
    }
    return data as Ticket;
  },

  async insertTicket(ticket: Ticket): Promise<boolean> {
    const { error } = await supabase.from("tickets").insert([ticket]);
    if (error) {
      console.error("Falha ao inserir chamado:", error.message);
      return false;
    }
    return true;
  },

  async updateTicketStatus(id: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from("tickets")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(`Falha ao atualizar status do chamado ${id}:`, error.message);
      return false;
    }
    return true;
  },

  // =========================================================================
  // COMENTÁRIOS E INTERAÇÕES (COMUNICAÇÃO INTERNA)
  // =========================================================================

  async getCommentsByTicketId(ticketId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("ticket_id", ticketId)
      // Ordena do mais antigo para o mais novo para montar o chat corretamente
      .order("created_at", { ascending: true });

    if (error) {
      console.error(
        `Falha ao buscar interações do chamado ${ticketId}:`,
        error.message,
      );
      return [];
    }
    return data as Comment[];
  },

  async insertComment(commentData: Comment): Promise<boolean> {
    const { error } = await supabase.from("comments").insert([
      {
        ticket_id: commentData.ticket_id,
        author: commentData.author,
        text: commentData.text,
        created_at: commentData.created_at || new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Falha ao inserir comentário no histórico:", error.message);
      return false;
    }
    return true;
  },
};
