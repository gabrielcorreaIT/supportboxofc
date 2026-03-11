/**
 * ============================================================================
 * 📦 ARQUIVO: src/lib/db.ts
 * 💻 PROJETO: SupportBox
 * 👨‍💻 DESENVOLVEDOR: Gabriel
 * 🏢 CONTEXTO: Sistema de comunicação entre um setor de TI e seus solicitantes
 * que abrem chamados.
 * * 📝 DESCRIÇÃO:
 * Este arquivo atua como a Camada de Acesso a Dados (Data Access Layer).
 * Ele centraliza toda a comunicação da aplicação com o banco de dados
 * PostgreSQL hospedado na nuvem pelo Supabase.
 * * ⚙️ REGRAS DE NEGÓCIO:
 * O sistema foi projetado estritamente para gerenciar a comunicação interna
 * entre a equipe técnica e os colaboradores da empresa. A adoção de um
 * banco real em nuvem permite que os chamados reflitam em tempo real no
 * painel da TI, possibilitando automações via Webhooks do Telegram e
 * conversas bidirecionais (comentários) nos tickets.
 * ============================================================================
 */

import { createClient } from "@supabase/supabase-js";

// =========================================================================
// 1. CONFIGURAÇÃO E CONEXÃO COM O BANCO DE DADOS
// =========================================================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// =========================================================================
// 2. TIPAGENS (INTERFACES DE DOMÍNIO)
// =========================================================================
export type Ticket = {
  id: string;
  requester: string;
  title: string;
  status: string;
  priority: string;
  date: string;
  description: string;
  created_at?: string;
  category?: string;
  type?: string;
};

// Nova interface para os comentários do chamado
export type Comment = {
  id?: string;
  ticket_id: string;
  author: string;
  text: string;
  created_at?: string;
};

// =========================================================================
// 3. SERVIÇOS DE BANCO DE DADOS (CRUD)
// =========================================================================
export const db = {
  getTickets: async (): Promise<Ticket[]> => {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Erro ao buscar chamados no Supabase:", error);
      return [];
    }
    return data || [];
  },

  getTicketById: async (id: string): Promise<Ticket | null> => {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return null;
    }
    return data as Ticket;
  },

  createTicket: async (
    description: string,
    category: string,
    requester: string = "Colaborador Logado",
  ): Promise<string> => {
    const isUrgent =
      description.toLowerCase().includes("servidor") ||
      description.toLowerCase().includes("urgente");

    const randomNum = Math.floor(Math.random() * 10000);
    const formattedNum = String(randomNum).padStart(4, "0");

    const newTicket: Ticket = {
      id: `CH-${formattedNum}`,
      requester: requester,
      title: category ? `Problema de ${category}` : "Novo Incidente",
      status: "Aguardando Atendimento",
      priority: isUrgent ? "Urgente" : "Média",
      date: new Date().toLocaleString("pt-BR"),
      description: description,
    };

    const { error } = await supabase.from("tickets").insert([newTicket]);

    if (error) {
      console.error("Erro ao inserir novo chamado:", error);
    }
    return newTicket.id;
  },

  updateTicketStatus: async (id: string, newStatus: string): Promise<void> => {
    const { error } = await supabase
      .from("tickets")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error(`Erro ao atualizar o status do chamado ${id}:`, error);
    }
  },

  // =======================================================================
  // 4. MÓDULO DE COMENTÁRIOS E COMUNICAÇÃO
  // =======================================================================

  /**
   * Busca todo o histórico de conversa de um chamado específico.
   */
  getTicketComments: async (ticketId: string): Promise<Comment[]> => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true }); // Ordena do mais antigo pro mais novo (estilo chat)

    if (error) {
      console.error(
        `Erro ao buscar comentários do chamado ${ticketId}:`,
        error,
      );
      return [];
    }
    return data || [];
  },

  /**
   * Adiciona uma nova mensagem (do solicitante ou da TI) na linha do tempo do chamado.
   */
  addTicketComment: async (
    ticketId: string,
    author: string,
    text: string,
  ): Promise<boolean> => {
    const newComment = {
      ticket_id: ticketId,
      author: author,
      text: text,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("comments").insert([newComment]);

    if (error) {
      console.error("Erro ao inserir novo comentário:", error);
      return false;
    }
    return true;
  },
};
