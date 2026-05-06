/**
 * Área de texto de várias linhas, com rótulo. Mantém a mesma
 * aparência dos demais campos para que os formulários fiquem
 * parecidos.
 */
"use client";

import type { TextareaHTMLAttributes } from "react";

interface PropsCampoTextoArea
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  rotulo: string;
}

export function CampoTextoArea({
  rotulo,
  id,
  className = "",
  rows = 4,
  ...resto
}: PropsCampoTextoArea) {
  const idCampo = id ?? `area-${rotulo.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={idCampo} className="text-sm font-medium text-tinta">
        {rotulo}
      </label>
      <textarea
        id={idCampo}
        rows={rows}
        className={[
          "px-3 py-2 border border-linha rounded-md bg-papel text-sm",
          "placeholder:text-tintaFraca focus:outline-none focus:ring-2",
          "focus:ring-marca/30 focus:border-marca resize-y",
          className,
        ].join(" ")}
        {...resto}
      />
    </div>
  );
}
