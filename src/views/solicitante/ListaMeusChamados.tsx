/**
 * Lista de chamados do solicitante.
 *
 * Mostra os chamados abertos pelo usuário entrado em formato de
 * cartão. Cada cartão exibe o título do chamado, o protocolo, a
 * categoria, a situação atual e a data de abertura. Ao clicar em
 * qualquer cartão, o componente dispara aoSelecionar com o id
 * correspondente, e quem usa o componente fica responsável por
 * carregar os detalhes e abrir a janela.
 *
 * O componente é puramente visual: não filtra nem ordena a lista
 * recebida. Espera receber os dados já prontos para exibir.
 */
"use client";

import { Clock } from "lucide-react";
import type { ChamadoResumo } from "@/views/compartilhado/tipos-view";
import { Etiqueta, corPorStatus } from "@/views/compartilhado/Etiqueta";

interface PropsListaMeusChamados {
  /** Lista de chamados do usuário, já vinda pronta para exibir. */
  chamados: ChamadoResumo[];
  /**
   * Função chamada quando o usuário clica em um cartão. Recebe
   * o id do chamado escolhido.
   */
  aoSelecionar?: (idChamado: string) => void;
}

export function ListaMeusChamados({
  chamados,
  aoSelecionar,
}: PropsListaMeusChamados) {
  // Estado vazio: quando o usuário ainda não tem chamados, mostra
  // uma mensagem amigável em vez de uma lista em branco.
  if (chamados.length === 0) {
    return (
      <div className="bg-papel border border-linha rounded-md p-8 text-center text-sm text-tintaFraca">
        Você ainda não possui chamados abertos.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {chamados.map((c) => (
        <li key={c.id}>
          {/*
            O cartão inteiro é um botão para que o usuário possa
            clicar em qualquer parte dele, e para que ele responda
            adequadamente à navegação por teclado.
          */}
          <button
            onClick={() => aoSelecionar?.(c.id)}
            className="w-full text-left bg-papel border border-linha rounded-md p-4 hover:border-marca focus:outline-none focus:ring-2 focus:ring-marca/30"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-tinta truncate">
                  {c.titulo}
                </p>
                <p className="text-xs text-tintaFraca mt-0.5 font-mono">
                  {c.protocolo} · {c.categoria}
                </p>
              </div>
              <Etiqueta classeCor={corPorStatus(c.status)}>{c.status}</Etiqueta>
            </div>
            {/*
              Linha inferior do cartão com a data e hora de abertura
              em destaque sutil, ao lado do ícone de relógio.
            */}
            <div className="mt-3 flex items-center gap-1.5 text-xs text-tintaFraca">
              <Clock className="w-3.5 h-3.5" />
              {c.criadoEmFormatado}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
