/**
 * CAMADA: Infraestrutura — Utilitarios de Apresentacao de Chamados
 * ARQUIVO: src/lib/ticket-utils.ts
 *
 * DESCRICAO:
 *   Funcoes auxiliares usadas pelas Views para exibir informacoes
 *   de chamados com cores e formatacao consistentes. Centraliza
 *   a logica de apresentacao para evitar duplicacao nos componentes.
 *
 * CONEXOES:
 *   - Nao depende de nenhum outro arquivo do projeto
 *   - Usado por: ticket-list, ticket-agent-modal, SolicitanteDashboard
 */

/**
 * Retorna a classe CSS de cor de fundo para um status.
 * Usada nos badges (etiquetas coloridas) de status dos chamados.
 *
 *   Aberto       -> laranja
 *   Em Andamento -> roxo
 *   Concluido    -> verde
 */
export function obterCorStatus(status: string): string {
  const s = status.toLowerCase();
  if (s === "aberto") return "bg-orange-500";
  if (s === "em andamento") return "bg-purple-500";
  if (s === "concluído") return "bg-green-500";
  return "bg-gray-500";
}

/**
 * Retorna a classe CSS de cor de fundo para uma prioridade.
 * Usada nos badges de prioridade na lista de chamados.
 *
 *   Urgente -> vermelho
 *   Alta    -> laranja
 *   Media   -> azul
 *   Baixa   -> verde
 */
export function obterCorPrioridade(prioridade: string): string {
  const p = prioridade.toLowerCase();
  if (p === "urgente") return "bg-red-500";
  if (p === "alta") return "bg-orange-500";
  if (p === "baixa") return "bg-green-500";
  return "bg-blue-500";
}

/**
 * Retorna classes CSS para badges de prioridade com borda.
 * Usada no modal de detalhes do chamado.
 */
export function obterInsigniaPrioridade(prioridade: string): string {
  const p = prioridade.toLowerCase();
  if (p === "urgente") return "bg-red-100 text-red-700 border-red-200";
  if (p === "alta") return "bg-orange-100 text-orange-700 border-orange-200";
  if (p === "baixa") return "bg-green-100 text-green-700 border-green-200";
  return "bg-blue-100 text-blue-700 border-blue-200";
}

/**
 * Formata uma data ISO (ex: "2024-01-15T14:30:00Z") para o formato
 * legivel brasileiro (ex: "15/01/2024, 14:30").
 */
export function formatarData(d: string): string {
  if (!d) return "Data desconhecida";
  return new Date(d).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
