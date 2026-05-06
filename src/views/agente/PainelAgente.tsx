/**
 * Painel principal do agente.
 *
 * Reúne em uma única tela a barra de filtros, a tabela de chamados
 * e a janela de detalhes em modo agente. Aplica em memória os
 * filtros locais (busca por palavra e aba de situação) sobre a
 * lista de chamados que recebe.
 *
 * Esses filtros são puramente visuais. Como não alteram os dados,
 * pertencem ao componente. Quando os controladores existirem, a
 * filtragem pode até migrar para o lado servidor, mas a interface
 * deste componente continua igual.
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
  /** Lista completa de chamados que aparece no painel. */
  chamados: ChamadoResumo[];
  /**
   * Função que devolve a versão completa de um chamado a partir
   * do id. Usada para alimentar a janela de detalhes quando o
   * agente clica em um chamado da tabela.
   */
  obterDetalhes: (idChamado: string) => ChamadoDetalhado | null;
  /** Função chamada quando o agente aperta Assumir na janela. */
  aoAssumir?: (idChamado: string) => void;
  /** Função chamada quando o agente aperta Concluir na janela. */
  aoConcluir?: (idChamado: string) => void;
  /** Função chamada quando o agente envia um comentário. */
  aoComentar?: (idChamado: string, texto: string) => void;
}

export function PainelAgente({
  chamados,
  obterDetalhes,
  aoAssumir,
  aoConcluir,
  aoComentar,
}: PropsPainelAgente) {
  // Estado dos filtros aplicados pelo agente.
  const [termoBusca, setTermoBusca] = useState("");
  const [abaStatus, setAbaStatus] = useState<AbaStatus>("todos");

  // Estado da janela de detalhes. Guarda o id do chamado aberto.
  // Quando vale null, a janela está fechada.
  const [idSelecionado, setIdSelecionado] = useState<string | null>(null);

  /*
    O useMemo evita que a filtragem rode novamente a cada
    redesenho quando nada relevante mudou. A lista derivada só é
    recalculada quando muda a lista original, a aba ativa ou o
    termo digitado. O filtro combina situação (aba) com busca por
    palavra em título, protocolo e solicitante.
  */
  const chamadosFiltrados = useMemo(() => {
    const termo = termoBusca.trim().toLowerCase();
    return chamados.filter((c) => {
      const correspondeStatus =
        abaStatus === "todos" || c.status === abaStatus;
      const correspondeBusca =
        termo === "" ||
        [c.titulo, c.protocolo, c.solicitante].some((t) =>
          t.toLowerCase().includes(termo),
        );
      return correspondeStatus && correspondeBusca;
    });
  }, [chamados, abaStatus, termoBusca]);

  // Versão completa do chamado aberto, derivada do id selecionado.
  // Quando nada está aberto, vale null.
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
        // As funções abaixo só disparam quando um chamado está
        // realmente selecionado, evitando avisos desnecessários
        // para os controladores quando idSelecionado for null.
        aoAssumir={() => idSelecionado && aoAssumir?.(idSelecionado)}
        aoConcluir={() => idSelecionado && aoConcluir?.(idSelecionado)}
        aoEnviarComentario={(texto) =>
          idSelecionado && aoComentar?.(idSelecionado, texto)
        }
      />
    </div>
  );
}
