/**
 * CAMADA: View (componente compartilhado)
 * ARQUIVO: src/views/compartilhado/Botao.tsx
 *
 * RESPONSABILIDADE
 *   Botão padrão do sistema. Centraliza a aparência (variantes,
 *   estados de hover/disabled) para que todas as Views fiquem
 *   visualmente coerentes sem repetir classes Tailwind.
 *
 * PRINCÍPIOS SOLID APLICADOS
 *   - SRP: o componente cuida apenas de RENDERIZAR um botão.
 *          Ele NÃO sabe nem se importa com o que acontece quando
 *          é clicado — quem clica define isso via prop `onClick`.
 *   - OCP: novas variantes podem ser adicionadas no objeto
 *          `variantes` sem alterar a lógica do componente.
 *   - ISP: a interface PropsBotao expõe apenas o necessário,
 *          herdando o resto direto de `<button>`.
 */
"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

/** Variantes visuais do botão. Cada uma transmite uma intenção. */
type VarianteBotao = "primario" | "secundario" | "perigo" | "fantasma";

interface PropsBotao extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Conteúdo do botão (texto, ícone, ou os dois). */
  children: ReactNode;
  /** Aparência. Padrão: "primario". */
  variante?: VarianteBotao;
  /** Faz o botão ocupar 100% da largura disponível. */
  larguraTotal?: boolean;
}

/**
 * Tabela "variante -> classes Tailwind".
 * Manter este mapa no topo do arquivo facilita o ajuste fino
 * da identidade visual sem mexer na lógica.
 */
const variantes: Record<VarianteBotao, string> = {
  primario:
    "bg-marca text-white hover:bg-marca-forte border border-marca",
  secundario:
    "bg-papel text-tinta hover:bg-fundo border border-linha",
  perigo:
    "bg-white text-red-700 hover:bg-red-50 border border-red-300",
  fantasma:
    "bg-transparent text-tintaFraca hover:bg-fundo border border-transparent",
};

export function Botao({
  children,
  variante = "primario",
  larguraTotal = false,
  className = "",
  type = "button",
  ...resto
}: PropsBotao) {
  const classesBase =
    "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm " +
    "font-medium rounded-md transition-colors disabled:opacity-50 " +
    "disabled:cursor-not-allowed";

  return (
    <button
      type={type}
      className={[
        classesBase,
        variantes[variante],
        larguraTotal ? "w-full" : "",
        className,
      ].join(" ")}
      {...resto}
    >
      {children}
    </button>
  );
}
