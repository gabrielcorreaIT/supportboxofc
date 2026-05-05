/**
 * Painel do solicitante.
 *
 * Reúne em uma só tela o cabeçalho, o formulário de abertura, a
 * lista Meus Chamados e a janela de detalhes em modo somente
 * leitura. Aqui há apenas a montagem da tela. Toda a parte visual
 * está nos componentes filhos.
 *
 * O único estado guardado neste arquivo é qual chamado está aberto
 * na janela de detalhes, e se a janela está aberta ou fechada. Isso
 * é só estado de tela, nada que mexa nos dados.
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
  /** Nome exibido no cabeçalho. */
  nomeUsuario: string;
  /** Lista resumida que alimenta a seção Meus Chamados. */
  chamados: ChamadoResumo[];
  /**
   * Função que devolve a versão completa de um chamado a partir do
   * id. Como por enquanto os dados são de exemplo, ela é síncrona.
   * Mais para a frente pode passar a devolver uma promessa.
   */
  obterDetalhes: (idChamado: string) => ChamadoDetalhado | null;

  /** Função chamada pelo botão Sair do cabeçalho. */
  aoSairClicado?: () => void;
  /** Função chamada quando o formulário de abertura é enviado. */
  aoCriarChamado?: (dados: DadosNovoChamado) => void;
  /** Função chamada quando o usuário envia um comentário. */
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
  // Qual chamado está aberto na janela de detalhes. Estado só de tela.
  const [idSelecionado, setIdSelecionado] = useState<string | null>(null);

  // Versão completa do chamado, calculada a partir do id selecionado.
  const detalhes = idSelecionado ? obterDetalhes(idSelecionado) : null;

  return (
    <>
      <Cabecalho
        nomeUsuario={nomeUsuario}
        subtitulo="Portal do Solicitante"
        aoSairClicado={aoSairClicado}
      />

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Primeira seção. Formulário para abrir um novo chamado. */}
        <section>
          <FormularioAberturaChamado aoEnviar={aoCriarChamado} />
        </section>

        {/* Segunda seção. Lista dos chamados do próprio usuário. */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-tinta">Meus Chamados</h2>
          <ListaMeusChamados
            chamados={chamados}
            aoSelecionar={(id) => setIdSelecionado(id)}
          />
        </section>
      </main>

      {/* Janela de detalhes em modo somente leitura. */}
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
