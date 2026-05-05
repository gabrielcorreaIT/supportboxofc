/**
 * CAMADA: View — Painel Orquestrador do Solicitante
 * ARQUIVO: src/views/solicitante/PainelSolicitante.tsx
 *
 * RESPONSABILIDADE
 *   Compor a tela do solicitante: cabeçalho, formulário de abertura,
 *   lista "Meus Chamados" e o modal de detalhes (em modo leitura).
 *   Aqui há SOMENTE composição — toda a lógica visual fica delegada
 *   aos componentes filhos.
 *
 * ESTADO LOCAL ACEITÁVEL
 *   Mantemos como estado de UI apenas o que NÃO é regra de negócio:
 *   - Qual chamado está selecionado para abrir o modal.
 *   - Se o modal está aberto.
 *   Essas decisões são puramente visuais (sem implicações no domínio).
 *
 * PRINCÍPIOS SOLID APLICADOS
 *   - SRP: orquestra os filhos; não busca dados, não autentica.
 *   - DIP: recebe TUDO que precisa via props (usuário, chamados,
 *          função para detalhes). Quando os Controllers existirem,
 *          a página passa as ações reais; este componente não muda.
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
  /** Lista resumida que alimenta "Meus Chamados". */
  chamados: ChamadoResumo[];
  /**
   * Função síncrona que devolve os detalhes de um chamado pelo id.
   * Mantemos síncrono nesta etapa porque os dados são mock; quando
   * houver Controllers, esta prop pode virar `Promise<ChamadoDetalhado>`.
   */
  obterDetalhes: (idChamado: string) => ChamadoDetalhado | null;

  /** Callback de logout — disparado pelo botão "Sair" do cabeçalho. */
  aoSairClicado?: () => void;
  /** Callback de envio do formulário de abertura. */
  aoCriarChamado?: (dados: DadosNovoChamado) => void;
  /** Callback de comentário enviado no modal. */
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
  // Estado VISUAL apenas — qual chamado está aberto no modal.
  const [idSelecionado, setIdSelecionado] = useState<string | null>(null);

  // Detalhes derivados de `idSelecionado`. Renderização pura — sem efeitos.
  const detalhes = idSelecionado ? obterDetalhes(idSelecionado) : null;

  return (
    <>
      <Cabecalho
        nomeUsuario={nomeUsuario}
        subtitulo="Portal do Solicitante"
        aoSairClicado={aoSairClicado}
      />

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* SEÇÃO 1 — formulário de abertura. */}
        <section>
          <FormularioAberturaChamado aoEnviar={aoCriarChamado} />
        </section>

        {/* SEÇÃO 2 — lista dos próprios chamados. */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-tinta">Meus Chamados</h2>
          <ListaMeusChamados
            chamados={chamados}
            aoSelecionar={(id) => setIdSelecionado(id)}
          />
        </section>
      </main>

      {/* Modal de detalhes — modo "leitura" para o solicitante. */}
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
