/**
 * CAMADA: Model — Tipos do Dominio
 * ARQUIVO: src/models/types.ts
 *
 * DESCRICAO:
 *   Define os "contratos" de dados do sistema — ou seja, a forma exata
 *   que cada entidade (chamado, comentario) tem dentro do SupportBox.
 *   Todos os outros arquivos do projeto importam estes tipos para
 *   garantir que os dados sejam consistentes em todas as camadas.
 *
 * CONEXOES:
 *   - Usado por: TicketModel, TicketController, e praticamente todas as Views
 *   - Nao depende de nenhum outro arquivo do projeto
 *
 * CONCEITOS:
 *   - "type" define um conjunto fixo de valores permitidos (ex: "Baixa" | "Alta")
 *   - "interface" define a estrutura de um objeto (quais campos ele tem)
 *   - "as const" torna o array imutavel e permite extrair os tipos dele
 */

// ---------------------------------------------------------------------------
// Tipos de valor (definem opcoes fixas do sistema)
// ---------------------------------------------------------------------------

/** Niveis de urgencia que um chamado pode ter. */
export type PrioridadeChamado = "Baixa" | "Média" | "Alta" | "Urgente";

/** Fases do ciclo de vida de um chamado. */
export type StatusChamado = "Aberto" | "Em Andamento" | "Concluído";

/** Departamentos/areas que um chamado pode pertencer. */
export const CATEGORIAS_VALIDAS = ["Hardware", "Software", "Acesso", "Rede"] as const;
export type CategoriaChamado = (typeof CATEGORIAS_VALIDAS)[number];

/** Lista de status em formato de array (util para validacoes nos Controllers). */
export const STATUS_VALIDOS: StatusChamado[] = ["Aberto", "Em Andamento", "Concluído"];

// ---------------------------------------------------------------------------
// Entidades do dominio (estrutura dos objetos principais)
// ---------------------------------------------------------------------------

/**
 * Chamado (Ticket) — a entidade central do sistema.
 * Representa um pedido de suporte feito por um solicitante.
 */
export interface Chamado {
  id: string;                    // Identificador unico (UUID)
  numero_protocolo: string;      // Codigo legivel (ex: "CH-A1B2C3D4")
  solicitante: string;           // Nome de quem abriu o chamado
  atribuido_a?: string;          // Nome do tecnico responsavel (opcional)
  titulo: string;                // Resumo curto do problema
  descricao: string;             // Detalhamento completo do problema
  status: StatusChamado;         // Fase atual: Aberto, Em Andamento ou Concluido
  prioridade: PrioridadeChamado; // Urgencia: Baixa, Media, Alta ou Urgente
  categoria: string;             // Area: Hardware, Software, Acesso ou Rede
  tipo: "incident" | "service_request"; // Incidente ou Solicitacao de servico
  criado_em: string;             // Data/hora de criacao (formato ISO)
  atualizado_em?: string;        // Data/hora da ultima atualizacao (opcional)
}

/**
 * Comentario — mensagem adicionada ao historico de um chamado.
 * Pode ser de um tecnico, do solicitante ou do sistema automatico.
 */
export interface Comentario {
  id?: string;          // Identificador unico (gerado pelo banco)
  chamado_id: string;   // ID do chamado ao qual este comentario pertence
  autor: string;        // Nome de quem escreveu
  texto: string;        // Conteudo da mensagem
  criado_em?: string;   // Data/hora de criacao (formato ISO)
}
