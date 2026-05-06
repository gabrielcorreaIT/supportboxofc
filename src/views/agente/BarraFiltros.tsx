/**
 * Barra de filtros usada no painel do agente.
 *
 * Reúne o campo de busca por palavra e as abas de situação. O
 * componente não filtra a lista de chamados por conta própria.
 * Ele só recebe os valores atuais e dispara as funções recebidas
 * quando o usuário interage. A filtragem acontece no PainelAgente,
 * que é quem detém a lista.
 *
 * Esse modelo de estado controlado por fora deixa a barra simples
 * e fácil de testar. Para mostrar a barra com qualquer combinação
 * de termo de busca e aba ativa, basta passar os valores como prop.
 */
"use client";

import { Search } from "lucide-react";

/**
 * Conjunto de filtros de situação aceitos. O valor todos significa
 * que nenhum filtro foi aplicado por situação. Os outros valores
 * coincidem com os possíveis status do chamado.
 */
export type AbaStatus = "todos" | "Aberto" | "Em Andamento" | "Concluído";

interface PropsBarraFiltros {
  /** Texto digitado no campo de busca, controlado por fora. */
  termoBusca: string;
  /** Aba de situação atualmente ativa. */
  abaAtiva: AbaStatus;
  /** Função chamada toda vez que o usuário troca o termo digitado. */
  aoMudarBusca: (texto: string) => void;
  /** Função chamada quando o usuário escolhe outra aba de situação. */
  aoMudarAba: (aba: AbaStatus) => void;
}

/**
 * Lista das abas exibidas, com o valor que vai para o filtro e o
 * rótulo mostrado ao usuário. Manter a lista em uma constante
 * facilita ajustar nomes ou ordem sem mexer no JSX.
 */
const ABAS: { valor: AbaStatus; rotulo: string }[] = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "Aberto", rotulo: "Abertos" },
  { valor: "Em Andamento", rotulo: "Em andamento" },
  { valor: "Concluído", rotulo: "Concluídos" },
];

export function BarraFiltros({
  termoBusca,
  abaAtiva,
  aoMudarBusca,
  aoMudarAba,
}: PropsBarraFiltros) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      {/*
        Campo de busca por palavra. O ícone de lupa fica posicionado
        de forma absoluta dentro da caixa, à esquerda do texto.
      */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-tintaFraca" />
        <input
          type="search"
          value={termoBusca}
          onChange={(e) => aoMudarBusca(e.target.value)}
          placeholder="Pesquisar por título, protocolo ou solicitante"
          className="w-full h-10 pl-9 pr-3 border border-linha rounded-md bg-papel text-sm focus:outline-none focus:ring-2 focus:ring-marca/30 focus:border-marca"
        />
      </div>

      {/*
        Conjunto de abas. Ao clicar em uma delas, chamamos
        aoMudarAba com o valor correspondente. A aba ativa recebe
        o destaque visual da marca.
      */}
      <div className="flex flex-wrap gap-1 bg-fundo p-1 rounded-md border border-linha">
        {ABAS.map(({ valor, rotulo }) => {
          const ativa = valor === abaAtiva;
          return (
            <button
              key={valor}
              onClick={() => aoMudarAba(valor)}
              className={[
                "px-3 py-1 text-xs rounded",
                ativa
                  ? "bg-marca text-white"
                  : "text-tintaFraca hover:bg-papel",
              ].join(" ")}
            >
              {rotulo}
            </button>
          );
        })}
      </div>
    </div>
  );
}
