/**
 * CAMADA: View (tipos auxiliares)
 * ARQUIVO: src/views/compartilhado/tipos-view.ts
 *
 * RESPONSABILIDADE
 *   Definir os formatos de dado que as Views precisam para renderizar.
 *   ATENÇÃO: estes tipos NÃO são os Models do sistema — são apenas
 *   contratos visuais. A View pede "me dê algo com este formato",
 *   sem se importar de onde os dados vêm.
 *
 * POR QUE FICAR AQUI E NÃO EM src/models/
 *   Nesta etapa, a camada Model ainda não existe. Manter os tipos
 *   exclusivamente da View permite trabalhar sem acoplar a estrutura
 *   final do banco. Quando os Models forem criados, este arquivo
 *   poderá ser substituído por imports de `src/models/types.ts`,
 *   ou os tipos podem virar "ViewModels" derivados dos Models.
 *
 * PRINCÍPIOS SOLID APLICADOS
 *   - SRP: cada tipo descreve uma única entidade visual.
 *   - ISP: as Views recebem apenas os campos de que precisam,
 *          via interfaces pequenas em cada componente.
 */

/** Papéis possíveis de um usuário no sistema. */
export type PapelUsuario = "solicitante" | "agente";

/** Status pelos quais um chamado passa. */
export type StatusChamado = "Aberto" | "Em Andamento" | "Concluído";

/** Níveis de urgência atribuíveis a um chamado. */
export type PrioridadeChamado = "Baixa" | "Média" | "Alta";

/** Áreas de classificação de um chamado. */
export type CategoriaChamado = "Hardware" | "Software" | "Acesso" | "Rede";

/** Distinção entre incidente (algo quebrou) e solicitação (algo novo). */
export type TipoChamado = "incidente" | "solicitacao";

/** Listas auxiliares — usadas para popular `<select>` no formulário. */
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
 * Forma reduzida de um usuário, usada apenas para exibir nome/papel
 * no cabeçalho ou na barra lateral.
 */
export interface UsuarioVisivel {
  nome: string;
  papel: PapelUsuario;
}

/**
 * Comentário/interação dentro do histórico de um chamado.
 * Apresentado em ordem cronológica no modal de detalhes.
 */
export interface ComentarioVisivel {
  id: string;        // chave estável para o React
  autor: string;     // quem escreveu
  texto: string;     // conteúdo da mensagem
  criadoEm: string;  // já formatado para humano (ex.: "22/03 10:30")
}

/**
 * Chamado resumido, exibido em listas e cartões.
 * Não traz histórico nem descrição longa para manter
 * a renderização das listas leve.
 */
export interface ChamadoResumo {
  id: string;
  protocolo: string;          // código curto e legível, ex.: "CH-2025-001"
  titulo: string;
  solicitante: string;
  categoria: CategoriaChamado;
  prioridade: PrioridadeChamado;
  status: StatusChamado;
  tipo: TipoChamado;
  atribuidoA?: string;        // nome do agente responsável (se houver)
  criadoEmFormatado: string;  // já em formato amigável
}

/**
 * Versão completa do chamado, usada no modal de detalhes.
 * Inclui descrição longa e histórico de comentários.
 */
export interface ChamadoDetalhado extends ChamadoResumo {
  descricao: string;
  comentarios: ComentarioVisivel[];
}
