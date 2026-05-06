/**
 * Campo de seleção com rótulo. A lista de opções vem de fora, então
 * o componente não sabe a categoria do que está sendo escolhido.
 *
 * Cada opção pode ser um texto puro, em que o mesmo valor serve
 * como rótulo, ou um par com valor e rótulo separados, útil quando
 * o valor interno é diferente do que se quer mostrar para o usuário.
 */
"use client";

import type { SelectHTMLAttributes } from "react";

export type OpcaoSelect = string | { valor: string; rotulo: string };

interface PropsCampoSelect
  extends SelectHTMLAttributes<HTMLSelectElement> {
  rotulo: string;
  opcoes: readonly OpcaoSelect[];
  textoPadrao?: string;
}

function normalizarOpcao(op: OpcaoSelect): { valor: string; rotulo: string } {
  return typeof op === "string" ? { valor: op, rotulo: op } : op;
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
        {opcoes.map((op) => {
          const { valor, rotulo: textoOpcao } = normalizarOpcao(op);
          return (
            <option key={valor} value={valor}>
              {textoOpcao}
            </option>
          );
        })}
      </select>
    </div>
  );
}
