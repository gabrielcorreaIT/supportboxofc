/**
 * Painel do solicitante. Reúne o cabeçalho, o formulário de abertura,
 * a lista Meus Chamados e a janela de detalhes em modo somente
 * leitura. O único estado guardado aqui é qual chamado está aberto
 * na janela.
 */
"use client";

import { useState } from "react";
import { Cabecalho } from "@/views/compartilhado/Cabecalho";
import { ModalDetalhesChamado } from "@/views/compartilhado/ModalDetalhesChamado";
import type {
  ChamadoDetalhado,
  ChamadoResumo,
} from "@/views/compartilhado/tipos-view";
import { FormularioAberturaChamado, type DadosNovoChamado } from "./FormularioAberturaChamado";
import { ListaMeusChamados } from "./ListaMeusChamados";

interface PropsPainelSolicitante {
  nomeUsuario: string;
  chamados: ChamadoResumo[];
  obterDetalhes: (idChamado: string) => ChamadoDetalhado | null;
  aoSairClicado?: () => void;
  aoCriarChamado?: (dados: DadosNovoChamado) => void;
  aoComentar?: (idChamado: string, texto: string) => void;
}

export function PainelSolicitante({
  nomeUsuario,
  chamados,
  obterDetalhes,
  aoSairClicado,
  aoCriarChamado,
  aoComentar,
}: PropsPainelSolicitante) {
  const [idSelecionado, setIdSelecionado] = useState<string | null>(null);
  const detalhes = idSelecionado ? obterDetalhes(idSelecionado) : null;

  return (
    <>
      <Cabecalho
        nomeUsuario={nomeUsuario}
        subtitulo="Portal do Solicitante"
        aoSairClicado={aoSairClicado}
      />

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <section>
          <FormularioAberturaChamado aoEnviar={aoCriarChamado} />
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-tinta">Meus Chamados</h2>
          <ListaMeusChamados
            chamados={chamados}
            aoSelecionar={(id) => setIdSelecionado(id)}
          />
        </section>
      </main>

      <ModalDetalhesChamado
        chamado={detalhes}
        aberto={idSelecionado !== null}
        aoFechar={() => setIdSelecionado(null)}
        modoAgente={false}
        aoEnviarComentario={(texto) =>
          idSelecionado && aoComentar?.(idSelecionado, texto)
        }
      />
    </>
  );
}
