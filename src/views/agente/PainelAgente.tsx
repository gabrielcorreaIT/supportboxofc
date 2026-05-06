/**
 * Painel do agente. Reúne a barra de filtros, a tabela de chamados
 * e a janela de detalhes em modo agente. A filtragem por palavra e
 * por aba de situação é feita em memória, já que é só efeito visual
 * sobre a lista recebida.
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
  aoAssumir?: (idChamado: string) => void;
  aoConcluir?: (idChamado: string) => void;
  aoComentar?: (idChamado: string, texto: string) => void;
}

export function PainelAgente({
  chamados,
  obterDetalhes,
  aoAssumir,
  aoConcluir,
  aoComentar,
}: PropsPainelAgente) {
  const [termoBusca, setTermoBusca] = useState("");
  const [abaStatus, setAbaStatus] = useState<AbaStatus>("todos");
  const [idSelecionado, setIdSelecionado] = useState<string | null>(null);

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
