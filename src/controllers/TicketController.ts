/**
 * ============================================================================
 * [C] CONTROLLER: TicketController (Server Actions)
 * ARQUIVO: src/controllers/TicketController.ts
 * ============================================================================
 * DESCRIÇÃO:
 * O Maestro. Executa a matemática do painel, orquestra a IA de triagem
 * e aplica regras de negócio de TI antes de salvar no Supabase.
 * ============================================================================
 */
"use server";

import { TicketModel } from "@/models/TicketModel";
import { IAModel } from "@/models/IAModel";
import { randomUUID } from "crypto";
import type { Ticket, TicketPriority } from "@/models/types";

// ============================================================================
// 1. FLUXO DO SOLICITANTE (Abertura e IA)
// ============================================================================
export async function analyzeProblemAction(description: string) {
  try {
    const aiResponse = await IAModel.analyzeDeflection(description);
    return { success: true, ...aiResponse };
  } catch (error) {
    console.error("Erro na triagem IA:", error);
    return { success: false, error: "Falha na análise inteligente." };
  }
}

export async function createTicketAction(
  description: string,
  category: any,
  requester: string,
) {
  try {
    // Regra de Negócio: Definição de Prioridade Simples
    const descLower = description.toLowerCase();
    const isUrgent =
      descLower.includes("servidor") ||
      descLower.includes("urgente") ||
      descLower.includes("parou");
    const priority: TicketPriority = isUrgent ? "Urgente" : "Média";

    // Geração do Protocolo
    const ticketNumber = `CH-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: Ticket = {
      id: randomUUID(),
      ticket_number: ticketNumber,
      requester,
      title: `Problema de ${category}`,
      description,
      status: "Aguardando Atendimento",
      priority,
      category,
      type: "incident",
      created_at: new Date().toISOString(),
    };

    const isSaved = await TicketModel.insertTicket(newTicket);
    if (!isSaved) throw new Error("Falha ao persistir no model");

    return { success: true, protocolNumber: ticketNumber };
  } catch (error) {
    return { success: false, error: "Falha ao registrar chamado formal." };
  }
}

// ============================================================================
// 2. FLUXO DO AGENTE DE TI (Dashboard e Ações)
// ============================================================================

/**
 * Puxa os chamados e já devolve a matemática do Dashboard calculada no Servidor!
 * Isso salva processamento no navegador do técnico.
 */
export async function getDashboardDataAction() {
  try {
    const tickets = await TicketModel.getAllActiveTickets();

    // Matemática dos KPIs no Servidor
    const total = tickets.length;
    const aguardando = tickets.filter(
      (t) => t.status === "Aguardando Atendimento" || t.status === "Pendente",
    ).length;
    const emAndamento = tickets.filter(
      (t) => t.status === "Em Andamento",
    ).length;
    const concluidos = tickets.filter(
      (t) => t.status === "Concluído" || t.status === "Resolvido",
    ).length;

    const urgentes = tickets.filter(
      (t) => t.priority === "Urgente" || t.priority === "Crítica",
    ).length;
    const altas = tickets.filter((t) => t.priority === "Alta").length;
    const medias = tickets.filter((t) => t.priority === "Média").length;
    const baixas = tickets.filter((t) => t.priority === "Baixa").length;

    const taxaResolucao =
      total === 0 ? 0 : Math.round((concluidos / total) * 100);

    return {
      success: true,
      data: {
        tickets, // A fila completa para renderizar a tabela
        metrics: {
          total,
          aguardando,
          emAndamento,
          concluidos,
          urgentes,
          altas,
          medias,
          baixas,
          taxaResolucao,
        },
      },
    };
  } catch (error) {
    console.error("Erro ao carregar Dashboard:", error);
    return { success: false, error: "Falha ao carregar métricas da TI." };
  }
}

// Reutilizamos a lógica que você já tinha visto para detalhes e comentários
export async function getTicketDetailsAction(protocol: string) {
  try {
    const ticket = await TicketModel.getByProtocol(protocol);
    if (!ticket) return { success: false, error: "Não encontrado." };
    const comments = await TicketModel.getCommentsByTicketId(ticket.id);
    return { success: true, data: { ...ticket, interactions: comments } };
  } catch (e) {
    return { success: false, error: "Erro interno." };
  }
}

export async function addTicketCommentAction(
  ticketId: string,
  author: string,
  text: string,
) {
  try {
    const isSaved = await TicketModel.insertComment({
      ticket_id: ticketId,
      author,
      text,
    });
    return { success: isSaved };
  } catch (e) {
    return { success: false };
  }
}
