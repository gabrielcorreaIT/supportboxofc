/**
 * CAMADA: View (componente compartilhado)
 * ARQUIVO: src/views/compartilhado/CampoSelect.tsx
 *
 * RESPONSABILIDADE
 *   Versão padronizada de um <select> com rótulo. Recebe a lista de
 *   opções como prop, mantendo o componente "burro" (sem regras de
 *   negócio sobre o que é uma opção válida).
 *
 *   Aceita dois formatos de opção:
 *     - string puro -> o mesmo texto é usado como `value` e como
 *                      rótulo visível (uso comum: prioridades, status).
 *     - { valor, rotulo } -> usado quando o valor técnico difere do
 *                            texto a ser mostrado ao usuário (ex.:
 *                            valor "incidente" exibido como "Incidente").
 *
 * PRINCÍPIOS SOLID APLICADOS
 *   - SRP: só renderiza o conjunto rótulo + select.
 *   - DIP: as opções vêm de fora; a View pai decide o domínio.
 *   - OCP: o tipo `OpcaoSelect` permite estender a forma das opções
 *          sem alterar quem já passa strings.
 */
"use client";

import type { SelectHTMLAttributes } from "react";

/** Opção do select: string simples OU par valor/rótulo. */
export type OpcaoSelect = string | { valor: string; rotulo: string };

interface PropsCampoSelect
  extends SelectHTMLAttributes<HTMLSelectElement> {
  rotulo: string;
  opcoes: readonly OpcaoSelect[];
  /** Texto da opção neutra inicial (ex.: "Selecione..."). Opcional. */
  textoPadrao?: string;
}

/** Normaliza qualquer formato de opção para `{ valor, rotulo }`. */
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
  // Garante associação acessível entre <label> e <select>.
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
