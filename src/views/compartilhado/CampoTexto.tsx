/**
 * Campo de texto de uma linha, com rótulo.
 *
 * Padroniza a aparência do par label e input para que os
 * formulários do sistema fiquem visualmente parecidos sem precisar
 * repetir as classes em cada componente. Aceita qualquer atributo
 * nativo de um input do HTML, como type, placeholder ou required,
 * porque estende InputHTMLAttributes e repassa tudo direto para
 * o elemento.
 */
"use client";

import type { InputHTMLAttributes } from "react";

interface PropsCampoTexto extends InputHTMLAttributes<HTMLInputElement> {
  /** Texto que aparece acima do campo. */
  rotulo: string;
  /**
   * Texto curto de apoio mostrado em cinza abaixo do campo. Útil
   * para indicar formato esperado ou limites de tamanho.
   */
  ajuda?: string;
}

export function CampoTexto({
  rotulo,
  ajuda,
  id,
  className = "",
  ...resto
}: PropsCampoTexto) {
  // Quando o id não é passado de fora, geramos um a partir do
  // rótulo. Isso garante que o atributo for do label fique ligado
  // ao input correto, o que é fundamental para acessibilidade.
  const idCampo = id ?? `campo-${rotulo.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={idCampo} className="text-sm font-medium text-tinta">
        {rotulo}
      </label>
      <input
        id={idCampo}
        className={[
          "h-10 px-3 border border-linha rounded-md bg-papel text-sm",
          "placeholder:text-tintaFraca focus:outline-none focus:ring-2",
          "focus:ring-marca/30 focus:border-marca",
          "disabled:bg-fundo disabled:text-tintaFraca",
          className,
        ].join(" ")}
        {...resto}
      />
      {ajuda && <span className="text-xs text-tintaFraca">{ajuda}</span>}
    </div>
  );
}
