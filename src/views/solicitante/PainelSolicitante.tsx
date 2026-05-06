/**
 * Painel principal do solicitante.
 *
 * Compõe a tela do portal: cabeçalho no topo, formulário para
 * abrir um chamado, lista dos chamados do usuário entrado e a
 * janela de detalhes em modo somente leitura. O componente apenas
 * organiza os filhos. Toda a lógica visual fica neles.
 *
 * O único estado guardado aqui é qual chamado está aberto na
 * janela de detalhes. Esse estado é puramente de tela e não
 * representa regra de negócio. Quando os controladores chegarem,
 * eles vão alimentar este componente pelas mesmas props que já
 * existem hoje, sem precisar refatorar nada.
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
  /** Nome exibido no cabeçalho ao lado do botão Sair. */
  nomeUsuario: string;
  /** Lista resumida usada para alimentar a seção Meus Chamados. */
  chamados: ChamadoResumo[];
  /**
   * Função que devolve a versão completa de um chamado a partir
   * do id. Hoje é síncrona porque os dados são de exemplo. Mais
   * para a frente pode virar uma função assíncrona, sem alterar
   * a forma como o painel a chama.
   */
  obterDetalhes: (idChamado: string) => ChamadoDetalhado | null;
  /** Função chamada quando o usuário aperta Sair no cabeçalho. */
  aoSairClicado?: () => void;
  /**
   * Função chamada quando o formulário de abertura é enviado.
   * Recebe os dados já validados pelo formulário.
   */
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
  // Id do chamado aberto na janela de detalhes. Quando vale null,
  // a janela está fechada.
  const [idSelecionado, setIdSelecionado] = useState<string | null>(null);

  // Versão completa do chamado aberto. Calculada a cada render
  // para refletir mudanças em obterDetalhes ou em idSelecionado.
  const detalhes = idSelecionado ? obterDetalhes(idSelecionado) : null;

  return (
    <>
      <Cabecalho
        nomeUsuario={nomeUsuario}
        subtitulo="Portal do Solicitante"
        aoSairClicado={aoSairClicado}
      />

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/*
          Primeira seção da tela: o formulário para abrir um novo
          chamado. Fica em destaque no topo porque é a ação mais
          comum do solicitante.
        */}
        <section>
          <FormularioAberturaChamado aoEnviar={aoCriarChamado} />
        </section>

        {/*
          Segunda seção: a lista dos chamados que esse usuário já
          abriu. O título da seção fica acima da lista para
          orientar a leitura.
        */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-tinta">Meus Chamados</h2>
          <ListaMeusChamados
            chamados={chamados}
            aoSelecionar={(id) => setIdSelecionado(id)}
          />
        </section>
      </main>

      {/*
        Janela de detalhes em modo somente leitura. O solicitante
        pode comentar mas não pode assumir nem concluir o chamado.
      */}
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
