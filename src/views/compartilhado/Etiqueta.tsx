/**
 * Marcação colorida usada para indicar situação, prioridade ou
 * tipo de chamado.
 *
 * Centraliza a relação entre o valor mostrado e a cor, evitando que
 * cada lista ou janela invente sua própria combinação. Para
 * adicionar uma nova paleta basta criar uma nova função do tipo
 * corPorAlgo neste arquivo, sem precisar mexer em quem já usa o
 * componente.
 */
"use client";

import type { ReactNode } from "react";
import type { PrioridadeChamado, StatusChamado } from "./tipos-view";

interface PropsEtiqueta {
  children: ReactNode;
  /** Conjunto de classes do Tailwind para fundo e texto. */
  classeCor: string;
}

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

// Funções auxiliares de cor. Traduzem o valor de cada situação ou
// prioridade no conjunto de classes correspondente.

/** Cor por situação do chamado. */
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

/** Cor por nível de prioridade. */
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
