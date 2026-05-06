/**
 * Campo de seleção com rótulo.
 *
 * O componente desenha o par de label e select e delega a lista de
 * opções para quem o utiliza. Por isso não sabe qual é o domínio do
 * que está sendo escolhido. Quando alguém pede um CampoSelect com
 * categorias, ele mostra categorias. Quando pede com prioridades,
 * mostra prioridades.
 *
 * Cada opção pode ser um texto puro, em que o mesmo valor serve
 * como rótulo, ou um par com valor e rótulo separados. O par é
 * útil quando o valor interno é diferente do que se quer exibir
 * para o usuário, como acontece com incidente exibido como
 * Incidente.
 */
"use client";

import type { SelectHTMLAttributes } from "react";

/**
 * Formato aceito para cada opção. Um texto simples vira valor e
 * rótulo iguais. Um objeto permite separar valor interno e rótulo
 * visível.
 */
export type OpcaoSelect = string | { valor: string; rotulo: string };

interface PropsCampoSelect
  extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Texto que aparece acima do campo. */
  rotulo: string;
  /** Lista de opções a mostrar dentro do select. */
  opcoes: readonly OpcaoSelect[];
  /**
   * Texto da opção neutra inicial, como Selecione. Quando passado,
   * o select começa em uma opção vazia que não corresponde a
   * nenhum valor real.
   */
  textoPadrao?: string;
}

/**
 * Converte qualquer formato de opção para o par padrão valor e
 * rótulo. Centraliza a normalização para que o restante do código
 * trabalhe sempre com o mesmo formato.
 */
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
  // Mesmo padrão dos outros campos: gera um id baseado no rótulo
  // quando não há um vindo de fora, garantindo a ligação acessível
  // entre label e select.
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
