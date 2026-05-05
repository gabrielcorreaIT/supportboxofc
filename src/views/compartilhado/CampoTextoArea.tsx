/**
 * CAMADA: View (componente compartilhado)
 * ARQUIVO: src/views/compartilhado/CampoTextoArea.tsx
 *
 * RESPONSABILIDADE
 *   Versão padronizada de um <textarea> com rótulo. Pareada com
 *   CampoTexto/CampoSelect para manter formulários visualmente
 *   uniformes em todo o sistema.
 *
 * PRINCÍPIOS SOLID APLICADOS
 *   - SRP: renderiza apenas rótulo + textarea.
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
