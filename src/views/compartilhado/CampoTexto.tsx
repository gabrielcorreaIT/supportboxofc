/**
 * Campo de texto de uma linha, com rótulo.
 *
 * Padroniza a aparência de label e input para evitar repetição em
 * cada formulário. Aceita qualquer atributo nativo de um input
 * comum, como placeholder ou type, repassando tudo direto para o
 * elemento.
 */
"use client";

import type { InputHTMLAttributes } from "react";

interface PropsCampoTexto extends InputHTMLAttributes<HTMLInputElement> {
  /** Texto que aparece acima do campo. */
  rotulo: string;
  /** Mensagem curta de ajuda mostrada abaixo do campo. */
  ajuda?: string;
}

export function CampoTexto({
  rotulo,
  ajuda,
  id,
  className = "",
  ...resto
}: PropsCampoTexto) {
  // Garante que label e input fiquem associados de forma acessível.
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
