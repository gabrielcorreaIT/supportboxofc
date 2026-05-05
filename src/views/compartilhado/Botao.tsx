/**
 * Botão padrão do sistema.
 *
 * Reúne em um só lugar a aparência dos botões para que todas as
 * telas fiquem visualmente parecidas sem precisar repetir as classes
 * em cada lugar. O componente cuida apenas de desenhar o botão. O
 * que acontece quando o usuário clica fica a cargo de quem usa o
 * componente, passando uma função em onClick.
 */
"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

/** Aparências disponíveis para o botão. */
type VarianteBotao = "primario" | "secundario" | "perigo" | "fantasma";

interface PropsBotao extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Conteúdo do botão. Pode ser texto, ícone ou os dois. */
  children: ReactNode;
  /** Aparência. Quando não informada, vale "primario". */
  variante?: VarianteBotao;
  /** Quando verdadeiro, o botão ocupa toda a largura disponível. */
  larguraTotal?: boolean;
}

/**
 * Tabela que liga cada aparência ao conjunto de classes do Tailwind.
 * Para incluir uma aparência nova basta adicionar uma chave aqui.
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
