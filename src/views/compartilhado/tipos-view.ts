/**
 * Formatos de dado usados pelas telas do sistema.
 *
 * Os tipos aqui descrevem o formato que as telas esperam receber
 * para conseguir mostrar as informações. Eles não correspondem ao
 * formato final guardado no banco. Quando a parte de modelos chegar,
 * é possível trocar este arquivo por imports vindos dali, ou manter
 * estes tipos como uma versão preparada para a tela.
 */

/** Papéis possíveis de um usuário no sistema. */
export type PapelUsuario = "solicitante" | "agente";

/** Situações pelas quais um chamado passa. */
export type StatusChamado = "Aberto" | "Em Andamento" | "Concluído";

/** Níveis de urgência atribuíveis a um chamado. */
export type PrioridadeChamado = "Baixa" | "Média" | "Alta";

/** Áreas de classificação de um chamado. */
export type CategoriaChamado = "Hardware" | "Software" | "Acesso" | "Rede";

/** Distinção entre incidente, quando algo quebrou, e solicitação,
 *  quando alguém pede algo novo. */
export type TipoChamado = "incidente" | "solicitacao";

/** Listas auxiliares usadas para popular os campos de seleção. */
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

/**
 * Forma curta de um usuário, usada para mostrar nome e papel no
 * cabeçalho ou na barra lateral.
 */
export interface UsuarioVisivel {
  nome: string;
  papel: PapelUsuario;
}

/**
 * Comentário do histórico de um chamado, mostrado em ordem
 * cronológica dentro da janela de detalhes.
 */
export interface ComentarioVisivel {
  id: string;
  autor: string;
  texto: string;
  criadoEm: string;
}

/**
 * Versão resumida de um chamado, exibida em listas e tabelas. Não
 * traz a descrição completa nem o histórico para deixar a lista
 * leve de carregar.
 */
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

/**
 * Versão completa de um chamado, usada na janela de detalhes. Inclui
 * a descrição longa e o histórico de comentários.
 */
export interface ChamadoDetalhado extends ChamadoResumo {
  descricao: string;
  comentarios: ComentarioVisivel[];
}
