/**
 * Marca colorida usada para indicar situação, prioridade ou tipo
 * de chamado nas listas e na janela de detalhes.
 *
 * O componente em si só desenha a pílula. A escolha da cor fica
 * fora dele, em funções auxiliares (corPorStatus e corPorPrioridade)
 * que traduzem o valor do domínio em um conjunto de classes do
 * Tailwind. Centralizar essa tradução em um lugar só evita que
 * cada lista invente sua própria combinação de cores.
 */
"use client";

import type { ReactNode } from "react";
import type { PrioridadeChamado, StatusChamado } from "./tipos-view";

interface PropsEtiqueta {
  /** Conteúdo da etiqueta. Geralmente é o nome da situação. */
  children: ReactNode;
  /**
   * Conjunto de classes do Tailwind para fundo, texto e borda.
   * Recebido como string para permitir qualquer combinação. As
   * funções corPorStatus e corPorPrioridade abaixo são as formas
   * recomendadas de gerar este valor.
   */
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

/**
 * Devolve as classes do Tailwind que combinam com a situação do
 * chamado. Aberto usa o tom da marca, Em Andamento usa o tom de
 * destaque e Concluído usa um verde suave para indicar conclusão.
 */
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

/**
 * Devolve as classes do Tailwind que combinam com a prioridade.
 * Baixa usa um cinza neutro, Média reaproveita o tom da marca e
 * Alta usa um vermelho discreto para chamar atenção.
 */
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
