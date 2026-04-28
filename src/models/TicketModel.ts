/**
 * CAMADA: Model — Persistencia de Chamados
 * ARQUIVO: src/models/TicketModel.ts
 *
 * DESCRICAO:
 *   Responsavel por toda comunicacao com o banco de dados (Supabase)
 *   relacionada a chamados e comentarios. Este arquivo apenas salva
 *   e busca dados — ele NAO contem regras de negocio (isso e papel
 *   dos Controllers).
 *
 * CONEXOES:
 *   - Depende de: supabase.ts (cliente do banco), types.ts (interfaces)
 *   - Usado por:  TicketController (que orquestra as regras de negocio)
 *
 * NOTA SOBRE MAPEAMENTO:
 *   As colunas do banco estao em ingles (ex: "ticket_number", "requester"),
 *   mas o codigo do projeto usa interfaces em portugues (ex: "numero_protocolo",
 *   "solicitante"). As funcoes "mapear..." fazem essa traducao em ambas as direcoes.
 */
import { supabase } from "@/lib/supabase";
import type { Chamado, Comentario } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Funcoes de mapeamento: banco (ingles) <-> dominio (portugues)
// ---------------------------------------------------------------------------

/** Converte uma linha do banco de dados para a interface Chamado. */
function mapearChamadoDoBanco(linha: any): Chamado {
  return {
    id: linha.id,
    numero_protocolo: linha.ticket_number,
    solicitante: linha.requester,
    atribuido_a: linha.assigned_to,
    titulo: linha.title,
    descricao: linha.description,
    status: linha.status,
    prioridade: linha.priority,
    categoria: linha.category,
    tipo: linha.type,
    criado_em: linha.created_at,
    atualizado_em: linha.updated_at,
  };
}

/** Converte a interface Chamado para o formato de colunas do banco. */
function mapearChamadoParaBanco(chamado: Chamado): Record<string, unknown> {
  return {
    id: chamado.id,
    ticket_number: chamado.numero_protocolo,
    requester: chamado.solicitante,
    assigned_to: chamado.atribuido_a,
    title: chamado.titulo,
    description: chamado.descricao,
    status: chamado.status,
    priority: chamado.prioridade,
    category: chamado.categoria,
    type: chamado.tipo,
    created_at: chamado.criado_em,
    updated_at: chamado.atualizado_em,
  };
}

/** Converte uma linha do banco de dados para a interface Comentario. */
function mapearComentarioDoBanco(linha: any): Comentario {
  return {
    id: linha.id,
    chamado_id: linha.ticket_id,
    autor: linha.author,
    texto: linha.text,
    criado_em: linha.created_at,
  };
}

// ---------------------------------------------------------------------------
// ChamadoModel — funcoes de acesso ao banco
// ---------------------------------------------------------------------------

export const ChamadoModel = {
  // === CHAMADOS ===

  /** Busca um chamado pelo numero de protocolo (ex: "CH-A1B2C3D4"). */
  async buscarPorProtocolo(numeroProtocolo: string): Promise<Chamado | null> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("ticket_number", numeroProtocolo)
      .single();

    if (error || !data) return null;
    return mapearChamadoDoBanco(data);
  },

  /** Retorna todos os chamados ordenados do mais recente ao mais antigo. */
  async buscarTodosChamadosAtivos(): Promise<Chamado[]> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return [];
    return (data as any[]).map(mapearChamadoDoBanco);
  },

  /** Retorna apenas os chamados abertos por um solicitante especifico. */
  async buscarChamadosPorSolicitante(solicitante: string): Promise<Chamado[]> {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("requester", solicitante)
      .order("created_at", { ascending: false });

    if (error) return [];
    return (data as any[]).map(mapearChamadoDoBanco);
  },

  /** Insere um novo chamado no banco. Retorna true se deu certo. */
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

  /** Atualiza o status de um chamado existente. */
  async atualizarStatusChamado(id: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from("tickets")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return false;
    return true;
  },

  /** Atribui um tecnico ao chamado e muda o status para "Em Andamento". */
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

  // === COMENTARIOS ===

  /** Retorna todos os comentarios de um chamado, do mais antigo ao mais novo. */
  async buscarComentariosPorChamadoId(chamadoId: string): Promise<Comentario[]> {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("ticket_id", chamadoId)
      .order("created_at", { ascending: true });

    if (error) return [];
    return (data as any[]).map(mapearComentarioDoBanco);
  },

  /** Insere um novo comentario no historico de um chamado. */
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
