/**
 * [C] CONTROLLER: TicketController (Server Actions)
 * ARQUIVO: src/controllers/TicketController.ts
 *
 * Orquestra triagem IA, regras de negocio e metricas do dashboard.
 */
"use server";

import { ChamadoModel } from "@/models/TicketModel";
import { IAModel } from "@/models/IAModel";
import { randomUUID } from "crypto";
import type { Chamado, Comentario, StatusChamado, CategoriaChamado } from "@/models/types";
import { CATEGORIAS_VALIDAS, STATUS_VALIDOS } from "@/models/types";

// -- Auxiliares --

const REGEX_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validar(valor: string, campo: string, min: number, max: number): string | null {
  const limpo = (valor ?? "").trim();
  if (!limpo) return `Campo "${campo}" e obrigatorio.`;
  if (limpo.length < min) return `"${campo}" deve ter no minimo ${min} caractere(s).`;
  if (limpo.length > max) return `"${campo}" deve ter no maximo ${max} caractere(s).`;
  return null;
}

// -- 1. FLUXO DO SOLICITANTE --

export async function acaoAnalisarProblema(descricao: string): Promise<{
  sucesso: boolean;
  escalado?: boolean;
  sugestao?: string;
  erro?: string;
}> {
  const err = validar(descricao, "Descricao", 10, 2000);
  if (err) return { sucesso: false, erro: err };

  try {
    const respostaIA = await IAModel.analisarDeflexao(descricao.trim());
    return { sucesso: true, escalado: respostaIA.escalado, sugestao: respostaIA.sugestao };
  } catch (error) {
    console.error("Erro na triagem IA:", error);
    return { sucesso: false, erro: "Falha na analise inteligente." };
  }
}

export async function acaoCriarChamado(
  titulo: string,
  descricao: string,
  categoria: string,
  tipo: "incident" | "service_request",
  solicitante: string,
): Promise<{ sucesso: boolean; numeroProtocolo?: string; erro?: string }> {
  const erroTitulo = validar(titulo, "Titulo", 5, 200);
  if (erroTitulo) return { sucesso: false, erro: erroTitulo };

  const erroDesc = validar(descricao, "Descricao", 10, 2000);
  if (erroDesc) return { sucesso: false, erro: erroDesc };

  if (!CATEGORIAS_VALIDAS.includes(categoria as CategoriaChamado)) {
    return { sucesso: false, erro: "Categoria invalida." };
  }

  if (tipo !== "incident" && tipo !== "service_request") {
    return { sucesso: false, erro: "Tipo de chamado invalido." };
  }

  const erroSolicitante = validar(solicitante, "Solicitante", 1, 100);
  if (erroSolicitante) return { sucesso: false, erro: erroSolicitante };

  try {
    // Deteccao simples de urgencia por palavras-chave
    const descMinuscula = descricao.toLowerCase();
    const ehUrgente = ["servidor", "urgente", "parou", "caiu", "fora do ar"]
      .some((palavra) => descMinuscula.includes(palavra));

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

// -- 2. CHAMADOS DO SOLICITANTE --

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

// -- 3. FLUXO DO AGENTE DE TI --

export async function acaoObterDadosPainel(): Promise<{
  sucesso: boolean;
  dados?: {
    chamados: Chamado[];
    metricas: {
      total: number;
      abertos: number;
      emAndamento: number;
      concluidos: number;
      taxaResolucao: number;
    };
  };
  erro?: string;
}> {
  try {
    const chamados = await ChamadoModel.buscarTodosChamadosAtivos();

    const total = chamados.length;
    const abertos = chamados.filter((c) => c.status === "Aberto").length;
    const emAndamento = chamados.filter((c) => c.status === "Em Andamento").length;
    const concluidos = chamados.filter((c) => c.status === "Concluído").length;
    const taxaResolucao = total === 0 ? 0 : Math.round((concluidos / total) * 100);

    return {
      sucesso: true,
      dados: { chamados, metricas: { total, abertos, emAndamento, concluidos, taxaResolucao } },
    };
  } catch (error) {
    console.error("Erro ao carregar Dashboard:", error);
    return { sucesso: false, erro: "Falha ao carregar metricas." };
  }
}

export async function acaoObterDetalhesChamado(protocolo: string): Promise<{
  sucesso: boolean;
  dados?: Chamado & { interacoes: Comentario[] };
  erro?: string;
}> {
  const err = validar(protocolo, "Protocolo", 1, 50);
  if (err) return { sucesso: false, erro: err };

  try {
    const chamado = await ChamadoModel.buscarPorProtocolo(protocolo.trim());
    if (!chamado) return { sucesso: false, erro: "Chamado nao encontrado." };
    const comentarios = await ChamadoModel.buscarComentariosPorChamadoId(chamado.id);
    return { sucesso: true, dados: { ...chamado, interacoes: comentarios } };
  } catch {
    return { sucesso: false, erro: "Erro ao buscar chamado." };
  }
}

export async function acaoAdicionarComentario(
  chamadoId: string,
  autor: string,
  texto: string,
): Promise<{ sucesso: boolean }> {
  if (!REGEX_UUID.test(chamadoId ?? "")) return { sucesso: false };
  const erroAutor = validar(autor, "Autor", 1, 100);
  if (erroAutor) return { sucesso: false };
  const erroTexto = validar(texto, "Comentario", 1, 5000);
  if (erroTexto) return { sucesso: false };

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

export async function acaoAtualizarStatus(
  id: string,
  status: string,
): Promise<{ sucesso: boolean }> {
  if (!REGEX_UUID.test(id ?? "")) return { sucesso: false };
  if (!STATUS_VALIDOS.includes(status as StatusChamado)) return { sucesso: false };

  try {
    return { sucesso: await ChamadoModel.atualizarStatusChamado(id, status) };
  } catch {
    return { sucesso: false };
  }
}

export async function acaoAtribuirChamado(
  chamadoId: string,
  nomeTecnico: string,
): Promise<{ sucesso: boolean }> {
  if (!REGEX_UUID.test(chamadoId ?? "")) return { sucesso: false };
  const erroNome = validar(nomeTecnico, "Tecnico", 1, 100);
  if (erroNome) return { sucesso: false };

  try {
    return { sucesso: await ChamadoModel.atribuirChamado(chamadoId, nomeTecnico) };
  } catch {
    return { sucesso: false };
  }
}
