/**
 * CAMADA: View — Painel Orquestrador do Agente
 * ARQUIVO: src/views/agente/PainelAgente.tsx
 *
 * RESPONSABILIDADE
 *   Compor a tela do agente: barra de filtros, tabela e modal de
 *   detalhes (em modo agente). Aplica em memória os filtros locais
 *   (busca + aba de status) sobre a lista recebida via prop.
 *
 *   A FILTRAGEM é puramente visual (não muda os dados), então mantê-la
 *   na View é aceitável e não viola SRP — não há regra de negócio aqui.
 *
 * PRINCÍPIOS SOLID APLICADOS
 *   - SRP: orquestra os filhos. Não autentica, não persiste.
 *   - DIP: dados e callbacks vêm de fora; o componente é
 *          testável isoladamente passando mocks.
 */
"use client";

import { useState, useMemo } from "react";
import type {
  ChamadoDetalhado,
  ChamadoResumo,
} from "@/views/compartilhado/tipos-view";
import { ModalDetalhesChamado } from "@/views/compartilhado/ModalDetalhesChamado";
import { BarraFiltros, type AbaStatus } from "./BarraFiltros";
import { TabelaChamados } from "./TabelaChamados";

interface PropsPainelAgente {
  chamados: ChamadoResumo[];
  obterDetalhes: (idChamado: string) => ChamadoDetalhado | null;

  /** Disparado quando o agente clica em "Assumir" no modal. */
  aoAssumir?: (idChamado: string) => void;
  /** Disparado quando o agente clica em "Concluir" no modal. */
  aoConcluir?: (idChamado: string) => void;
  /** Disparado quando o agente envia um comentário. */
  aoComentar?: (idChamado: string, texto: string) => void;
}

export function PainelAgente({
  chamados,
  obterDetalhes,
  aoAssumir,
  aoConcluir,
  aoComentar,
}: PropsPainelAgente) {
  // Estado de UI: filtros + qual chamado está aberto.
  const [termoBusca, setTermoBusca] = useState("");
  const [abaStatus, setAbaStatus] = useState<AbaStatus>("todos");
  const [idSelecionado, setIdSelecionado] = useState<string | null>(null);

  // useMemo evita recalcular a lista a cada render se nada mudou.
  // Filtragem composta (status + termo) — pertence à View porque é
  // apenas exibição; nenhum dado é alterado.
  const chamadosFiltrados = useMemo(() => {
    const termo = termoBusca.trim().toLowerCase();
    return chamados.filter((c) => {
      const correspondeStatus = abaStatus === "todos" || c.status === abaStatus;
      const correspondeBusca =
        termo === "" ||
        [c.titulo, c.protocolo, c.solicitante].some((t) =>
          t.toLowerCase().includes(termo),
        );
      return correspondeStatus && correspondeBusca;
    });
  }, [chamados, abaStatus, termoBusca]);

  const detalhes = idSelecionado ? obterDetalhes(idSelecionado) : null;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-tinta">Painel de Controle</h1>
        <p className="text-sm text-tintaFraca">
          Visão geral dos chamados do sistema.
        </p>
      </div>

      <BarraFiltros
        termoBusca={termoBusca}
        abaAtiva={abaStatus}
        aoMudarBusca={setTermoBusca}
        aoMudarAba={setAbaStatus}
      />

      <TabelaChamados
        chamados={chamadosFiltrados}
        aoSelecionar={(id) => setIdSelecionado(id)}
      />

      <ModalDetalhesChamado
        chamado={detalhes}
        aberto={idSelecionado !== null}
        aoFechar={() => setIdSelecionado(null)}
        modoAgente
        aoAssumir={() => idSelecionado && aoAssumir?.(idSelecionado)}
        aoConcluir={() => idSelecionado && aoConcluir?.(idSelecionado)}
        aoEnviarComentario={(texto) =>
          idSelecionado && aoComentar?.(idSelecionado, texto)
        }
      />
    </div>
  );
}
