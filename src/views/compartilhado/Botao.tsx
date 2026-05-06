/**
 * Botão padrão usado em todo o sistema.
 *
 * Reúne em um lugar só a aparência dos botões para que todas as
 * telas fiquem visualmente parecidas sem repetir as classes do
 * Tailwind em cada componente. O botão cuida apenas de desenhar
 * o elemento. O que acontece quando o usuário clica fica a cargo
 * de quem está usando o botão, passando uma função em onClick.
 */
"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Aparências disponíveis para o botão. Cada nome representa uma
 * intenção visual diferente:
 *
 * primario serve para a ação principal de cada tela.
 * secundario para ações de apoio que não precisam de destaque.
 * perigo para ações de remoção ou cancelamento.
 * fantasma para botões discretos que se misturam ao fundo.
 */
type VarianteBotao = "primario" | "secundario" | "perigo" | "fantasma";

/**
 * Props do botão. Estende todos os atributos nativos de um
 * <button> do HTML, então qualquer atributo padrão (onClick,
 * disabled, type, etc.) pode ser passado normalmente.
 */
interface PropsBotao extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Conteúdo do botão. Pode ser texto, ícone ou os dois. */
  children: ReactNode;
  /** Aparência usada. Quando não informado, vale primario. */
  variante?: VarianteBotao;
  /** Quando verdadeiro, o botão ocupa toda a largura disponível. */
  larguraTotal?: boolean;
}

/**
 * Tabela que liga cada aparência ao conjunto de classes do Tailwind
 * correspondente. Manter este mapa no topo do arquivo facilita
 * ajustar a identidade visual sem precisar mexer na lógica do
 * componente. Para criar uma aparência nova, basta adicionar uma
 * chave aqui e o tipo VarianteBotao acima.
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
  // Classes que valem para qualquer aparência. Cuidam do tamanho,
  // espaçamento, tipografia e dos estados de desativado.
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
