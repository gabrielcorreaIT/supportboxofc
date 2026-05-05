/**
 * Tabela de chamados do agente.
 *
 * Mostra a lista de chamados em formato de tabela. O agente precisa
 * comparar muitos chamados de uma vez, então a tabela funciona
 * melhor do que cartões.
 */
"use client";

import type { ChamadoResumo } from "@/views/compartilhado/tipos-view";
import {
  Etiqueta,
  corPorPrioridade,
  corPorStatus,
} from "@/views/compartilhado/Etiqueta";

interface PropsTabelaChamados {
  /** Lista que já vem filtrada por quem usa o componente. */
  chamados: ChamadoResumo[];
  /** Função chamada quando o usuário clica em Detalhes. */
  aoSelecionar?: (idChamado: string) => void;
}

export function TabelaChamados({
  chamados,
  aoSelecionar,
}: PropsTabelaChamados) {
  if (chamados.length === 0) {
    return (
      <div className="bg-papel border border-linha rounded-md p-8 text-center text-sm text-tintaFraca">
        Nenhum chamado encontrado para os filtros atuais.
      </div>
    );
  }

  return (
    <div className="bg-papel border border-linha rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-fundo border-b border-linha text-tintaFraca">
          <tr>
            <Th>Protocolo</Th>
            <Th>Título</Th>
            <Th>Solicitante</Th>
            <Th>Categoria</Th>
            <Th>Prioridade</Th>
            <Th>Situação</Th>
            <Th>Aberto em</Th>
            <Th className="text-right">Ações</Th>
          </tr>
        </thead>
        <tbody>
          {chamados.map((c) => (
            <tr
              key={c.id}
              className="border-b border-linha last:border-b-0 hover:bg-fundo/60"
            >
              <Td className="font-mono text-xs">{c.protocolo}</Td>
              <Td className="font-medium text-tinta">{c.titulo}</Td>
              <Td>{c.solicitante}</Td>
              <Td>{c.categoria}</Td>
              <Td>
                <Etiqueta classeCor={corPorPrioridade(c.prioridade)}>
                  {c.prioridade}
                </Etiqueta>
              </Td>
              <Td>
                <Etiqueta classeCor={corPorStatus(c.status)}>
                  {c.status}
                </Etiqueta>
              </Td>
              <Td className="text-tintaFraca text-xs">{c.criadoEmFormatado}</Td>
              <Td className="text-right">
                <button
                  onClick={() => aoSelecionar?.(c.id)}
                  className="text-marca hover:text-marca-forte text-xs font-medium"
                >
                  Detalhes
                </button>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Componentes auxiliares usados só dentro deste arquivo. Padronizam
// o espaçamento das células do cabeçalho e do corpo da tabela.
function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={[
        "text-left text-xs uppercase font-semibold px-4 py-2",
        className,
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={["px-4 py-3", className].join(" ")}>{children}</td>;
}
