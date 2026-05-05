/**
 * CAMADA: View (componente compartilhado)
 * ARQUIVO: src/views/compartilhado/CampoSelect.tsx
 *
 * RESPONSABILIDADE
 *   Versão padronizada de um <select> com rótulo. Recebe a lista
 *   de opções como prop, mantendo o componente "burro" (sem regras
 *   de negócio sobre o que é uma opção válida).
 *
 * PRINCÍPIOS SOLID APLICADOS
 *   - SRP: só renderiza o conjunto rótulo + select.
 *   - DIP: as opções vêm de fora (a View chamadora decide o domínio
 *          — categorias, prioridades, etc.). O componente não sabe
 *          qual lista está exibindo.
 */
"use client";

import type { SelectHTMLAttributes } from "react";

interface PropsCampoSelect
  extends SelectHTMLAttributes<HTMLSelectElement> {
  rotulo: string;
  opcoes: readonly string[];
  /** Texto da opção neutra (ex.: "Selecione..."). Opcional. */
  textoPadrao?: string;
}

export function CampoSelect({
  rotulo,
  opcoes,
  textoPadrao,
  id,
  className = "",
  ...resto
}: PropsCampoSelect) {
  const idCampo = id ?? `select-${rotulo.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={idCampo} className="text-sm font-medium text-tinta">
        {rotulo}
      </label>
      <select
        id={idCampo}
        className={[
          "h-10 px-3 border border-linha rounded-md bg-papel text-sm",
          "focus:outline-none focus:ring-2 focus:ring-marca/30",
          "focus:border-marca",
          className,
        ].join(" ")}
        {...resto}
      >
        {textoPadrao && <option value="">{textoPadrao}</option>}
        {opcoes.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </div>
  );
}
