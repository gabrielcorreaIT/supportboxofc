/**
 * Utilitarios de apresentacao de chamados.
 * ARQUIVO: src/lib/ticket-utils.ts
 */

export function obterCorStatus(status: string): string {
  const s = status.toLowerCase();
  if (s === "aberto") return "bg-orange-500";
  if (s === "em andamento") return "bg-purple-500";
  if (s === "concluído") return "bg-green-500";
  return "bg-gray-500";
}

export function obterCorPrioridade(prioridade: string): string {
  const p = prioridade.toLowerCase();
  if (p === "urgente") return "bg-red-500";
  if (p === "alta") return "bg-orange-500";
  if (p === "baixa") return "bg-green-500";
  return "bg-blue-500"; // Média
}

export function obterInsigniaPrioridade(prioridade: string): string {
  const p = prioridade.toLowerCase();
  if (p === "urgente") return "bg-red-100 text-red-700 border-red-200";
  if (p === "alta") return "bg-orange-100 text-orange-700 border-orange-200";
  if (p === "baixa") return "bg-green-100 text-green-700 border-green-200";
  return "bg-blue-100 text-blue-700 border-blue-200";
}

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
