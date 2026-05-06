/**
 * Marca colorida usada para indicar situação, prioridade ou tipo do
 * chamado. Centraliza a relação entre o valor mostrado e a cor, para
 * que cada lista ou janela não invente sua própria combinação.
 */
"use client";

import type { ReactNode } from "react";
import type { PrioridadeChamado, StatusChamado } from "./tipos-view";

interface PropsEtiqueta {
  children: ReactNode;
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
