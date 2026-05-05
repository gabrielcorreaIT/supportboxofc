/**
 * CAMADA: View (componente compartilhado)
 * ARQUIVO: src/views/compartilhado/CampoTexto.tsx
 *
 * RESPONSABILIDADE
 *   Padroniza um campo de entrada com rótulo. Centraliza o estilo
 *   de label + input para evitar repetição em vários formulários.
 *
 * PRINCÍPIOS SOLID APLICADOS
 *   - SRP: cuida só do par "label + input de uma linha".
 *   - OCP: aceita qualquer prop nativa de <input> via `...resto`,
 *          permitindo extensão (placeholder, type="email", etc.)
 *          sem alterar este arquivo.
 */
"use client";

import type { InputHTMLAttributes } from "react";

interface PropsCampoTexto extends InputHTMLAttributes<HTMLInputElement> {
  /** Rótulo visível acima do campo. */
  rotulo: string;
  /** Mensagem de ajuda/erro mostrada abaixo do campo (opcional). */
  ajuda?: string;
}

export function CampoTexto({
  rotulo,
  ajuda,
  id,
  className = "",
  ...resto
}: PropsCampoTexto) {
  // Garante associação acessível entre <label> e <input>.
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
