/**
 * CAMADA: View — Barra de Filtros do Agente
 * ARQUIVO: src/views/agente/BarraFiltros.tsx
 *
 * RESPONSABILIDADE
 *   Conjunto de campo de busca + abas de status. NÃO filtra a lista
 *   por conta própria — apenas avisa quem a usa, via callbacks, que
 *   o usuário trocou o termo de busca ou o filtro ativo.
 *
 * PRINCÍPIOS SOLID APLICADOS
 *   - SRP: dispara eventos quando o usuário interage. A regra de
 *          filtragem em si fica em quem consome este componente.
 *   - DIP: estado controlado de fora — a View pai mantém os valores
 *          atuais e os repassa de volta como props.
 */
"use client";

import { Search } from "lucide-react";

/** Conjunto de filtros de status (mais "Todos") usados nas abas. */
export type AbaStatus = "todos" | "Aberto" | "Em Andamento" | "Concluído";

interface PropsBarraFiltros {
  termoBusca: string;
  abaAtiva: AbaStatus;
  aoMudarBusca: (texto: string) => void;
  aoMudarAba: (aba: AbaStatus) => void;
}

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
      {/* Campo de busca. */}
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

      {/* Abas de status — acionam `aoMudarAba`. */}
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
