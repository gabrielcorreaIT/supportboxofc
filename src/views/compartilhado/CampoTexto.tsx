/**
 * Campo de texto de uma linha, com rótulo. Padroniza a aparência
 * para os formulários ficarem parecidos sem repetir as classes.
 */
"use client";

import type { InputHTMLAttributes } from "react";

interface PropsCampoTexto extends InputHTMLAttributes<HTMLInputElement> {
  rotulo: string;
  ajuda?: string;
}

export function CampoTexto({
  rotulo,
  ajuda,
  id,
  className = "",
  ...resto
}: PropsCampoTexto) {
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
