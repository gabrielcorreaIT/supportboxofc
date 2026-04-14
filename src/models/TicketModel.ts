/**
 * [M] MODEL: ChamadoModel
 * ARQUIVO: src/models/TicketModel.ts
 *
 * Responsavel exclusivo pela persistencia de chamados e comentarios.
 * Sem regras de negocio — isso e papel do Controller.
 *
 * Os nomes das colunas no banco (Supabase) permanecem em ingles.
 * As funcoes de mapeamento convertem entre o esquema do banco
 * e as interfaces do dominio em portugues.
 */
import { supabase } from "@/lib/supabase";
import type { Chamado, Comentario } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Mapeia uma linha do banco (colunas em ingles) para a interface Chamado. */
function mapearChamadoDoBanco(d: any): Chamado {
  return {
    id: d.id,
    numero_protocolo: d.ticket_number,
    solicitante: d.requester,
    atribuido_a: d.assigned_to,
    titulo: d.title,
    descricao: d.description,
    status: d.status,
    prioridade: d.priority,
    categoria: d.category,
    tipo: d.type,
    criado_em: d.created_at,
    atualizado_em: d.updated_at,
  };
}

/** Mapeia a interface Chamado para as colunas do banco (ingles). */
function mapearChamadoParaBanco(c: Chamado): Record<string, unknown> {
  return {
    id: c.id,
    ticket_number: c.numero_protocolo,
    requester: c.solicitante,
    assigned_to: c.atribuido_a,
    title: c.titulo,
    description: c.descricao,
    status: c.status,
    priority: c.prioridade,
    category: c.categoria,
    type: c.tipo,
    created_at: c.criado_em,
    updated_at: c.atualizado_em,
  };
}

/** Mapeia uma linha do banco para a interface Comentario. */
function mapearComentarioDoBanco(d: any): Comentario {
  return {
    id: d.id,
    chamado_id: d.ticket_id,
    autor: d.author,
    texto: d.text,
    criado_em: d.created_at,
  };
}

export const ChamadoModel = {
  // -- CHAMADOS --

  async buscarPorProtocolo(numeroProtocolo: string): Promise<Chamado | null> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("ticket_number", numeroProtocolo)
      .single();

    if (error || !data) return null;
    return mapearChamadoDoBanco(data);
  },

  async buscarTodosChamadosAtivos(): Promise<Chamado[]> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return [];
    return (data as any[]).map(mapearChamadoDoBanco);
  },

  async buscarChamadosPorSolicitante(solicitante: string): Promise<Chamado[]> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("requester", solicitante)
      .order("created_at", { ascending: false });

    if (error) return [];
    return (data as any[]).map(mapearChamadoDoBanco);
  },

  async buscarChamadoPorId(id: string): Promise<Chamado | null> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return mapearChamadoDoBanco(data);
  },

  async inserirChamado(chamado: Chamado): Promise<boolean> {
    const { error } = await supabase
      .from("tickets")
      .insert([mapearChamadoParaBanco(chamado)]);
    if (error) {
      console.error("Falha ao inserir chamado:", error.message);
      return false;
    }
    return true;
  },

  async atualizarStatusChamado(id: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from("tickets")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return false;
    return true;
  },

  async atribuirChamado(id: string, nomeTecnico: string): Promise<boolean> {
    const { error } = await supabase
      .from("tickets")
      .update({
        assigned_to: nomeTecnico,
        status: "Em Andamento",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return false;
    return true;
  },

  // -- COMENTARIOS --

  async buscarComentariosPorChamadoId(chamadoId: string): Promise<Comentario[]> {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("ticket_id", chamadoId)
      .order("created_at", { ascending: true });

    if (error) return [];
    return (data as any[]).map(mapearComentarioDoBanco);
  },

  async inserirComentario(comentario: Comentario): Promise<boolean> {
    const { error } = await supabase.from("comments").insert([
      {
        ticket_id: comentario.chamado_id,
        author: comentario.autor,
        text: comentario.texto,
        created_at: comentario.criado_em ?? new Date().toISOString(),
      },
    ]);

    if (error) return false;
    return true;
  },
};
