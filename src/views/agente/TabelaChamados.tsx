/**
 * CAMADA: View — Tabela de Chamados (agente)
 * ARQUIVO: src/views/agente/TabelaChamados.tsx
 *
 * RESPONSABILIDADE
 *   Exibir a lista de TODOS os chamados num formato tabular,
 *   adequado ao painel do agente. O agente quer comparar muitos
 *   chamados rapidamente — daí a escolha de tabela em vez de cartões.
 *
 * PRINCÍPIOS SOLID APLICADOS
 *   - SRP: só desenha a tabela.
 *   - ISP: a interface PropsTabelaChamados é mínima — recebe a
 *          lista já filtrada e um callback de seleção.
 */
"use client";

import type { ChamadoResumo } from "@/views/compartilhado/tipos-view";
import {
  Etiqueta,
  corPorPrioridade,
  corPorStatus,
} from "@/views/compartilhado/Etiqueta";

interface PropsTabelaChamados {
  /** Lista já filtrada por quem chama o componente. */
  chamados: ChamadoResumo[];
  /** Disparado ao clicar em "Detalhes". */
  aoSelecionar?: (idChamado: string) => void;
}

export function TabelaChamados({
  chamados,
  aoSelecionar,
}: PropsTabelaChamados) {
  // Estado vazio.
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
            <Th>Status</Th>
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

// ---------------------------------------------------------------------------
// Subcomponentes locais — só padronizam o espaçamento das células.
// ---------------------------------------------------------------------------

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
