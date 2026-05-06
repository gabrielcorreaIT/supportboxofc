/**
 * Área de texto de várias linhas, com rótulo.
 *
 * Acompanha a mesma identidade visual do CampoTexto e do
 * CampoSelect, para que os formulários inteiros fiquem com a
 * mesma cara. Como estende TextareaHTMLAttributes, qualquer
 * atributo nativo de textarea, como rows, placeholder ou required,
 * pode ser passado normalmente.
 */
"use client";

import type { TextareaHTMLAttributes } from "react";

interface PropsCampoTextoArea
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Texto que aparece acima do campo. */
  rotulo: string;
}

export function CampoTextoArea({
  rotulo,
  id,
  className = "",
  rows = 4,
  ...resto
}: PropsCampoTextoArea) {
  // Mesmo princípio do CampoTexto: quando o id não é passado, ele
  // é gerado a partir do rótulo para manter label e textarea
  // associados de forma acessível.
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
