/**
 * CAMADA: View (componente compartilhado)
 * ARQUIVO: src/views/compartilhado/Etiqueta.tsx
 *
 * RESPONSABILIDADE
 *   "Pílula" colorida usada para indicar status, prioridade ou
 *   tipo de chamado. Centraliza a relação entre valor textual e
 *   cor, evitando que listas e modais reinventem essa decisão.
 *
 * PRINCÍPIOS SOLID APLICADOS
 *   - SRP: traduz um valor para uma representação visual.
 *   - OCP: novas paletas (status, prioridade, etc.) viram novas
 *          funções `corDe...` neste arquivo, sem alterar quem
 *          já usa o componente.
 */
"use client";

import type { ReactNode } from "react";
import type { PrioridadeChamado, StatusChamado } from "./tipos-view";

interface PropsEtiqueta {
  children: ReactNode;
  /** Classes Tailwind para fundo + texto. Use os helpers abaixo. */
  classeCor: string;
}

/** Renderiza a etiqueta visual. */
export function Etiqueta({ children, classeCor }: PropsEtiqueta) {
  return (
    <span
      className={[
        "inline-block px-2 py-0.5 text-xs font-medium",
        "rounded border",
        classeCor,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Helpers de cor — traduzem valor de domínio para classes Tailwind.
// Mantidos aqui (em vez de inline) para que a paleta seja consistente.
// ---------------------------------------------------------------------------

/** Cor por status (Aberto/Em Andamento/Concluído). */
export function corPorStatus(status: StatusChamado): string {
  switch (status) {
    case "Aberto":
      return "bg-marca-fraca text-marca-forte border-marca/30";
    case "Em Andamento":
      return "bg-destaque-fraca text-destaque border-destaque/30";
    case "Concluído":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
}

/** Cor por prioridade (Baixa/Média/Alta). */
export function corPorPrioridade(p: PrioridadeChamado): string {
  switch (p) {
    case "Baixa":
      return "bg-fundo text-tintaFraca border-linha";
    case "Média":
      return "bg-marca-fraca text-marca-forte border-marca/30";
    case "Alta":
      return "bg-red-50 text-red-700 border-red-200";
  }
}
