/**
 * Botão padrão do sistema. Reúne a aparência num só lugar para que
 * todas as telas fiquem parecidas sem repetir as classes. O que
 * acontece no clique fica a cargo de quem usa o componente.
 */
"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type VarianteBotao = "primario" | "secundario" | "perigo" | "fantasma";

interface PropsBotao extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variante?: VarianteBotao;
  larguraTotal?: boolean;
}

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
