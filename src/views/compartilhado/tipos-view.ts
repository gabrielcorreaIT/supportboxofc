/**
 * Formatos de dado que as telas do sistema esperam receber.
 *
 * Os tipos definidos aqui não correspondem ao formato final que vai
 * ser guardado no banco. Eles descrevem o que a parte visual precisa
 * para conseguir mostrar as informações. Quando a camada de modelos
 * chegar, estes tipos podem virar imports vindos dali, ou ser
 * mantidos como uma versão preparada especialmente para a tela.
 */

/** Papéis possíveis de um usuário no sistema. */
export type PapelUsuario = "solicitante" | "agente";

/**
 * Situações pelas quais um chamado passa ao longo do atendimento.
 * Os valores estão escritos com a inicial em maiúscula porque são
 * usados como rótulos exibidos diretamente na tela.
 */
export type StatusChamado = "Aberto" | "Em Andamento" | "Concluído";

/** Níveis de urgência atribuíveis a um chamado. */
export type PrioridadeChamado = "Baixa" | "Média" | "Alta";

/** Áreas de classificação de um chamado. */
export type CategoriaChamado = "Hardware" | "Software" | "Acesso" | "Rede";

/**
 * Distinção entre incidente, quando algo parou de funcionar, e
 * solicitação, quando o usuário pede um recurso novo. Os valores
 * estão em minúscula porque são códigos internos. Quando são
 * mostrados na tela, recebem rótulos formatados.
 */
export type TipoChamado = "incidente" | "solicitacao";

/**
 * Lista de situações disponíveis. Útil para alimentar campos de
 * seleção em filtros e formulários, sem precisar repetir o array
 * em cada lugar.
 */
export const STATUS_DISPONIVEIS: StatusChamado[] = [
  "Aberto",
  "Em Andamento",
  "Concluído",
];

/** Lista de prioridades disponíveis para campos de seleção. */
export const PRIORIDADES_DISPONIVEIS: PrioridadeChamado[] = [
  "Baixa",
  "Média",
  "Alta",
];

/** Lista de categorias disponíveis para campos de seleção. */
export const CATEGORIAS_DISPONIVEIS: CategoriaChamado[] = [
  "Hardware",
  "Software",
  "Acesso",
  "Rede",
];

/**
 * Forma curta de um usuário, usada quando precisamos só do nome e
 * do papel. Aparece no cabeçalho do solicitante e na barra lateral
 * do agente.
 */
export interface UsuarioVisivel {
  /** Nome completo do usuário, mostrado na tela. */
  nome: string;
  /** Papel que o usuário cumpre no sistema. */
  papel: PapelUsuario;
}

/**
 * Comentário do histórico de um chamado, mostrado em ordem
 * cronológica dentro da janela de detalhes.
 */
export interface ComentarioVisivel {
  /** Identificador único, usado pelo React como chave da lista. */
  id: string;
  /** Quem escreveu o comentário (nome do usuário ou Sistema). */
  autor: string;
  /** Texto do comentário. */
  texto: string;
  /** Data e hora já formatadas para exibição (ex.: 22/03 10:30). */
  criadoEm: string;
}

/**
 * Versão resumida de um chamado, exibida em listas e tabelas. Não
 * traz a descrição completa nem o histórico, para deixar a lista
 * leve de carregar mesmo com muitos chamados ao mesmo tempo.
 */
export interface ChamadoResumo {
  /** Identificador único do chamado. */
  id: string;
  /** Código curto e legível, no formato CH-AAAA-NNN. */
  protocolo: string;
  /** Resumo curto do problema ou da solicitação. */
  titulo: string;
  /** Nome de quem abriu o chamado. */
  solicitante: string;
  /** Área em que o chamado se encaixa. */
  categoria: CategoriaChamado;
  /** Nível de urgência. */
  prioridade: PrioridadeChamado;
  /** Em que parte do atendimento o chamado está. */
  status: StatusChamado;
  /** Indica se é incidente ou solicitação. */
  tipo: TipoChamado;
  /** Nome do agente responsável, quando já houver. */
  atribuidoA?: string;
  /** Data e hora de abertura, já formatadas para exibição. */
  criadoEmFormatado: string;
}

/**
 * Versão completa de um chamado, usada na janela de detalhes.
 * Acrescenta a descrição longa e o histórico de comentários.
 */
export interface ChamadoDetalhado extends ChamadoResumo {
  /** Texto completo escrito pelo solicitante na abertura. */
  descricao: string;
  /** Lista de comentários do histórico, em ordem cronológica. */
  comentarios: ComentarioVisivel[];
}
