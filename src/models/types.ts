/**
 * [M] TYPES: Dominio da aplicacao
 * ARQUIVO: src/models/types.ts
 */
export type TicketPriority = "Baixa" | "Média" | "Alta" | "Urgente";

export type TicketStatus = "Aberto" | "Em Andamento" | "Concluído";

export const VALID_CATEGORIES = ["Hardware", "Software", "Acesso", "Rede"] as const;
export type TicketCategory = (typeof VALID_CATEGORIES)[number];

export const VALID_STATUSES: TicketStatus[] = ["Aberto", "Em Andamento", "Concluído"];

export interface Ticket {
  id: string;
  ticket_number: string;
  requester: string;
  assigned_to?: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  type: "incident" | "service_request";
  created_at: string;
  updated_at?: string;
}

export interface Comment {
  id?: string;
  ticket_id: string;
  author: string;
  text: string;
  created_at?: string;
}
