/**
 * [C] CONTROLLER: TicketController (Server Actions)
 * ARQUIVO: src/controllers/TicketController.ts
 *
 * Orquestra triagem IA, regras de negocio e metricas do dashboard.
 */
"use server";

import { TicketModel } from "@/models/TicketModel";
import { IAModel } from "@/models/IAModel";
import { randomUUID } from "crypto";
import type { Ticket, Comment, TicketStatus, TicketCategory } from "@/models/types";
import { VALID_CATEGORIES, VALID_STATUSES } from "@/models/types";

// -- Helpers --

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validate(value: string, field: string, min: number, max: number): string | null {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return `Campo "${field}" e obrigatorio.`;
  if (trimmed.length < min) return `"${field}" deve ter no minimo ${min} caractere(s).`;
  if (trimmed.length > max) return `"${field}" deve ter no maximo ${max} caractere(s).`;
  return null;
}

// -- 1. FLUXO DO SOLICITANTE --

export async function analyzeProblemAction(description: string): Promise<{
  success: boolean;
  isEscalated?: boolean;
  suggestion?: string;
  error?: string;
}> {
  const err = validate(description, "Descricao", 10, 2000);
  if (err) return { success: false, error: err };

  try {
    const aiResponse = await IAModel.analyzeDeflection(description.trim());
    return { success: true, ...aiResponse };
  } catch (error) {
    console.error("Erro na triagem IA:", error);
    return { success: false, error: "Falha na analise inteligente." };
  }
}

export async function createTicketAction(
  title: string,
  description: string,
  category: string,
  type: "incident" | "service_request",
  requester: string,
): Promise<{ success: boolean; protocolNumber?: string; error?: string }> {
  const titleErr = validate(title, "Titulo", 5, 200);
  if (titleErr) return { success: false, error: titleErr };

  const descErr = validate(description, "Descricao", 10, 2000);
  if (descErr) return { success: false, error: descErr };

  if (!VALID_CATEGORIES.includes(category as TicketCategory)) {
    return { success: false, error: "Categoria invalida." };
  }

  if (type !== "incident" && type !== "service_request") {
    return { success: false, error: "Tipo de chamado invalido." };
  }

  const reqErr = validate(requester, "Solicitante", 1, 100);
  if (reqErr) return { success: false, error: reqErr };

  try {
    // Deteccao simples de urgencia por palavras-chave
    const descLower = description.toLowerCase();
    const isUrgent = ["servidor", "urgente", "parou", "caiu", "fora do ar"]
      .some((keyword) => descLower.includes(keyword));

    const ticketNumber = `CH-${randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;

    const newTicket: Ticket = {
      id: randomUUID(),
      ticket_number: ticketNumber,
      requester: requester.trim(),
      title: title.trim(),
      description: description.trim(),
      status: "Aberto",
      priority: isUrgent ? "Urgente" : "Média",
      category,
      type,
      created_at: new Date().toISOString(),
    };

    const isSaved = await TicketModel.insertTicket(newTicket);
    if (!isSaved) throw new Error("Falha ao persistir no Model.");

    return { success: true, protocolNumber: ticketNumber };
  } catch (error) {
    console.error("Erro ao criar chamado:", error);
    return { success: false, error: "Falha ao registrar chamado." };
  }
}

// -- 2. CHAMADOS DO SOLICITANTE --

export async function getMyTicketsAction(requester: string): Promise<{
  success: boolean;
  tickets?: Ticket[];
  error?: string;
}> {
  if (!requester) return { success: false, error: "Solicitante nao informado." };

  try {
    const tickets = await TicketModel.getTicketsByRequester(requester);
    return { success: true, tickets };
  } catch {
    return { success: false, error: "Falha ao buscar seus chamados." };
  }
}

// -- 3. FLUXO DO AGENTE DE TI --

export async function getDashboardDataAction(): Promise<{
  success: boolean;
  data?: {
    tickets: Ticket[];
    metrics: {
      total: number;
      abertos: number;
      emAndamento: number;
      concluidos: number;
      taxaResolucao: number;
    };
  };
  error?: string;
}> {
  try {
    const tickets = await TicketModel.getAllActiveTickets();

    const total = tickets.length;
    const abertos = tickets.filter((t) => t.status === "Aberto").length;
    const emAndamento = tickets.filter((t) => t.status === "Em Andamento").length;
    const concluidos = tickets.filter((t) => t.status === "Concluído").length;
    const taxaResolucao = total === 0 ? 0 : Math.round((concluidos / total) * 100);

    return {
      success: true,
      data: { tickets, metrics: { total, abertos, emAndamento, concluidos, taxaResolucao } },
    };
  } catch (error) {
    console.error("Erro ao carregar Dashboard:", error);
    return { success: false, error: "Falha ao carregar metricas." };
  }
}

export async function getTicketDetailsAction(protocol: string): Promise<{
  success: boolean;
  data?: Ticket & { interactions: Comment[] };
  error?: string;
}> {
  const err = validate(protocol, "Protocolo", 1, 50);
  if (err) return { success: false, error: err };

  try {
    const ticket = await TicketModel.getByProtocol(protocol.trim());
    if (!ticket) return { success: false, error: "Chamado nao encontrado." };
    const comments = await TicketModel.getCommentsByTicketId(ticket.id);
    return { success: true, data: { ...ticket, interactions: comments } };
  } catch {
    return { success: false, error: "Erro ao buscar chamado." };
  }
}

export async function addTicketCommentAction(
  ticketId: string,
  author: string,
  text: string,
): Promise<{ success: boolean }> {
  if (!UUID_REGEX.test(ticketId ?? "")) return { success: false };
  const authorErr = validate(author, "Autor", 1, 100);
  if (authorErr) return { success: false };
  const textErr = validate(text, "Comentario", 1, 5000);
  if (textErr) return { success: false };

  try {
    const comment: Comment = {
      ticket_id: ticketId,
      author: author.trim(),
      text: text.trim(),
    };
    return { success: await TicketModel.insertComment(comment) };
  } catch {
    return { success: false };
  }
}

export async function updateTicketStatusAction(
  id: string,
  status: string,
): Promise<{ success: boolean }> {
  if (!UUID_REGEX.test(id ?? "")) return { success: false };
  if (!VALID_STATUSES.includes(status as TicketStatus)) return { success: false };

  try {
    return { success: await TicketModel.updateTicketStatus(id, status) };
  } catch {
    return { success: false };
  }
}

export async function assignTicketAction(
  ticketId: string,
  technicianName: string,
): Promise<{ success: boolean }> {
  if (!UUID_REGEX.test(ticketId ?? "")) return { success: false };
  const nameErr = validate(technicianName, "Tecnico", 1, 100);
  if (nameErr) return { success: false };

  try {
    return { success: await TicketModel.assignTicket(ticketId, technicianName) };
  } catch {
    return { success: false };
  }
}
