/**
 * CAMADA: Controller — Gerenciamento de Chamados
 * ARQUIVO: src/controllers/TicketController.ts
 *
 * DESCRICAO:
 *   Contem a logica de negocio relacionada a chamados (tickets).
 *   Atua como intermediario entre as Views (telas) e o Model (banco de dados).
 *   Todas as funcoes rodam no servidor via Server Actions do Next.js.
 *
 * CONEXOES:
 *   - Depende de: ChamadoModel (persistencia), IAModel (triagem IA), types.ts
 *   - Usado por:  SolicitanteDashboard, TicketForm, ticket-list,
 *                 ticket-agent-modal, AIAgent, TelegramController
 */
"use server";

import { ChamadoModel } from "@/models/TicketModel";
import { IAModel } from "@/models/IAModel";
import { randomUUID } from "crypto";
import type { Chamado, Comentario, StatusChamado, CategoriaChamado } from "@/models/types";
import { CATEGORIAS_VALIDAS, STATUS_VALIDOS } from "@/models/types";

// ===========================================================================
// 1. FLUXO DO SOLICITANTE
// ===========================================================================

/** Triagem inteligente: a IA tenta sugerir uma solucao automatica. */
export async function acaoAnalisarProblema(descricao: string): Promise<{
  sucesso: boolean;
  escalado?: boolean;
  sugestao?: string;
  erro?: string;
}> {
  if (!descricao.trim()) {
    return { sucesso: false, erro: "Descreva o problema." };
  }

  try {
    const respostaIA = await IAModel.analisarDeflexao(descricao.trim());
    return { sucesso: true, escalado: respostaIA.escalado, sugestao: respostaIA.sugestao };
  } catch (error) {
    console.error("Erro na triagem IA:", error);
    return { sucesso: false, erro: "Falha na analise inteligente." };
  }
}

/** Cria um novo chamado no sistema. */
export async function acaoCriarChamado(
  titulo: string,
  descricao: string,
  categoria: string,
  tipo: "incident" | "service_request",
  solicitante: string,
): Promise<{ sucesso: boolean; numeroProtocolo?: string; erro?: string }> {
  if (!titulo.trim() || !descricao.trim() || !solicitante.trim()) {
    return { sucesso: false, erro: "Preencha todos os campos obrigatorios." };
  }

  if (!CATEGORIAS_VALIDAS.includes(categoria as CategoriaChamado)) {
    return { sucesso: false, erro: "Categoria invalida." };
  }

  try {
    // Detecta urgencia por palavras-chave na descricao
    const descMinuscula = descricao.toLowerCase();
    const ehUrgente = ["servidor", "urgente", "parou", "caiu", "fora do ar"]
      .some((palavra) => descMinuscula.includes(palavra));

    // Gera um protocolo unico legivel (ex: "CH-A1B2C3D4")
    const numeroProtocolo = `CH-${randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;

    const novoChamado: Chamado = {
      id: randomUUID(),
      numero_protocolo: numeroProtocolo,
      solicitante: solicitante.trim(),
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      status: "Aberto",
      prioridade: ehUrgente ? "Urgente" : "Média",
      categoria,
      tipo,
      criado_em: new Date().toISOString(),
    };

    const salvo = await ChamadoModel.inserirChamado(novoChamado);
    if (!salvo) throw new Error("Falha ao persistir no Model.");

    return { sucesso: true, numeroProtocolo };
  } catch (error) {
    console.error("Erro ao criar chamado:", error);
    return { sucesso: false, erro: "Falha ao registrar chamado." };
  }
}

/** Retorna os chamados de um solicitante especifico. */
export async function acaoObterMeusChamados(solicitante: string): Promise<{
  sucesso: boolean;
  chamados?: Chamado[];
  erro?: string;
}> {
  if (!solicitante) return { sucesso: false, erro: "Solicitante nao informado." };

  try {
    const chamados = await ChamadoModel.buscarChamadosPorSolicitante(solicitante);
    return { sucesso: true, chamados };
  } catch {
    return { sucesso: false, erro: "Falha ao buscar seus chamados." };
  }
}

// ===========================================================================
// 2. FLUXO DO AGENTE DE TI
// ===========================================================================

/** Retorna todos os chamados ordenados do mais recente ao mais antigo. */
export async function acaoListarChamados(): Promise<{
  sucesso: boolean;
  chamados?: Chamado[];
  erro?: string;
}> {
  try {
    const chamados = await ChamadoModel.buscarTodosChamadosAtivos();
    return { sucesso: true, chamados };
  } catch (error) {
    console.error("Erro ao listar chamados:", error);
    return { sucesso: false, erro: "Falha ao carregar chamados." };
  }
}

/** Retorna os dados completos de um chamado (com historico de comentarios). */
export async function acaoObterDetalhesChamado(protocolo: string): Promise<{
  sucesso: boolean;
  dados?: Chamado & { interacoes: Comentario[] };
  erro?: string;
}> {
  if (!protocolo.trim()) return { sucesso: false, erro: "Protocolo nao informado." };

  try {
    const chamado = await ChamadoModel.buscarPorProtocolo(protocolo.trim());
    if (!chamado) return { sucesso: false, erro: "Chamado nao encontrado." };

    const comentarios = await ChamadoModel.buscarComentariosPorChamadoId(chamado.id);
    return { sucesso: true, dados: { ...chamado, interacoes: comentarios } };
  } catch {
    return { sucesso: false, erro: "Erro ao buscar chamado." };
  }
}

/** Adiciona um comentario ao historico do chamado. */
export async function acaoAdicionarComentario(
  chamadoId: string,
  autor: string,
  texto: string,
): Promise<{ sucesso: boolean }> {
  if (!chamadoId || !autor.trim() || !texto.trim()) {
    return { sucesso: false };
  }

  try {
    const comentario: Comentario = {
      chamado_id: chamadoId,
      autor: autor.trim(),
      texto: texto.trim(),
    };
    return { sucesso: await ChamadoModel.inserirComentario(comentario) };
  } catch {
    return { sucesso: false };
  }
}

/** Altera o status de um chamado. */
export async function acaoAtualizarStatus(
  id: string,
  status: string,
): Promise<{ sucesso: boolean }> {
  if (!id || !STATUS_VALIDOS.includes(status as StatusChamado)) {
    return { sucesso: false };
  }

  try {
    return { sucesso: await ChamadoModel.atualizarStatusChamado(id, status) };
  } catch {
    return { sucesso: false };
  }
}

/** Atribui um tecnico como responsavel pelo chamado. */
export async function acaoAtribuirChamado(
  chamadoId: string,
  nomeTecnico: string,
): Promise<{ sucesso: boolean }> {
  if (!chamadoId || !nomeTecnico.trim()) {
    return { sucesso: false };
  }

  try {
    return { sucesso: await ChamadoModel.atribuirChamado(chamadoId, nomeTecnico) };
  } catch {
    return { sucesso: false };
  }
}
