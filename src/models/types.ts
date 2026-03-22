export type TicketPriority = "Baixa" | "Média" | "Alta" | "Urgente" | "Crítica";

export type TicketStatus = 
  | "Aguardando Atendimento" 
  | "Pendente" 
  | "Em Andamento" 
  | "Concluído" 
  | "Resolvido";

export interface Ticket {
  id: string;
  ticket_number: string;
  requester: string;
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
