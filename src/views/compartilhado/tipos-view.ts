/**
 * Formatos de dado que as telas do sistema esperam receber. Não são
 * o formato final guardado no banco. Quando os modelos chegarem,
 * estes tipos podem virar imports da camada de dados.
 */

export type PapelUsuario = "solicitante" | "agente";

export type StatusChamado = "Aberto" | "Em Andamento" | "Concluído";

export type PrioridadeChamado = "Baixa" | "Média" | "Alta";

export type CategoriaChamado = "Hardware" | "Software" | "Acesso" | "Rede";

export type TipoChamado = "incidente" | "solicitacao";

export const STATUS_DISPONIVEIS: StatusChamado[] = [
  "Aberto",
  "Em Andamento",
  "Concluído",
];

export const PRIORIDADES_DISPONIVEIS: PrioridadeChamado[] = [
  "Baixa",
  "Média",
  "Alta",
];

export const CATEGORIAS_DISPONIVEIS: CategoriaChamado[] = [
  "Hardware",
  "Software",
  "Acesso",
  "Rede",
];

export interface UsuarioVisivel {
  nome: string;
  papel: PapelUsuario;
}

export interface ComentarioVisivel {
  id: string;
  autor: string;
  texto: string;
  criadoEm: string;
}

export interface ChamadoResumo {
  id: string;
  protocolo: string;
  titulo: string;
  solicitante: string;
  categoria: CategoriaChamado;
  prioridade: PrioridadeChamado;
  status: StatusChamado;
  tipo: TipoChamado;
  atribuidoA?: string;
  criadoEmFormatado: string;
}

export interface ChamadoDetalhado extends ChamadoResumo {
  descricao: string;
  comentarios: ComentarioVisivel[];
}
