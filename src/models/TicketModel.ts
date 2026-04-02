/**
 * [M] MODEL: TicketModel
 * ARQUIVO: src/models/TicketModel.ts
 *
 * Responsavel exclusivo pela persistencia de chamados e comentarios.
 * Sem regras de negocio — isso e papel do Controller.
 */
import { supabase } from "@/lib/supabase";
import type { Ticket, Comment } from "./types";

export const TicketModel = {
  // -- CHAMADOS --

  async getByProtocol(ticketNumber: string): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("ticket_number", ticketNumber)
      .single();

    if (error || !data) return null;
    return data as Ticket;
  },

  async getAllActiveTickets(): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return [];
    return data as Ticket[];
  },

  async getTicketsByRequester(requester: string): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("requester", requester)
      .order("created_at", { ascending: false });

    if (error) return [];
    return data as Ticket[];
  },

  async getTicketById(id: string): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
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
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return false;
    return true;
  },

  async assignTicket(id: string, technicianName: string): Promise<boolean> {
    const { error } = await supabase
      .from("tickets")
      .update({
        assigned_to: technicianName,
        status: "Em Andamento",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return false;
    return true;
  },

  // -- COMENTARIOS --

  async getCommentsByTicketId(ticketId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (error) return [];
    return data as Comment[];
  },

  async insertComment(commentData: Comment): Promise<boolean> {
    const { error } = await supabase.from("comments").insert([
      {
        ticket_id: commentData.ticket_id,
        author: commentData.author,
        text: commentData.text,
        created_at: commentData.created_at ?? new Date().toISOString(),
      },
    ]);

    if (error) return false;
    return true;
  },
};
