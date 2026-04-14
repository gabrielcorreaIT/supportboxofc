/**
 * [M] TYPES: Dominio da aplicacao
 * ARQUIVO: src/models/types.ts
 */
export type PrioridadeChamado = "Baixa" | "Média" | "Alta" | "Urgente";

export type StatusChamado = "Aberto" | "Em Andamento" | "Concluído";

export const CATEGORIAS_VALIDAS = ["Hardware", "Software", "Acesso", "Rede"] as const;
export type CategoriaChamado = (typeof CATEGORIAS_VALIDAS)[number];

export const STATUS_VALIDOS: StatusChamado[] = ["Aberto", "Em Andamento", "Concluído"];

export interface Chamado {
  id: string;
  numero_protocolo: string;
  solicitante: string;
  atribuido_a?: string;
  titulo: string;
  descricao: string;
  status: StatusChamado;
  prioridade: PrioridadeChamado;
  categoria: string;
  tipo: "incident" | "service_request";
  criado_em: string;
  atualizado_em?: string;
}

export interface Comentario {
  id?: string;
  chamado_id: string;
  autor: string;
  texto: string;
  criado_em?: string;
}
