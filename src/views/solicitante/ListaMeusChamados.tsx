/**
 * CAMADA: View — Lista "Meus Chamados" (solicitante)
 * ARQUIVO: src/views/solicitante/ListaMeusChamados.tsx
 *
 * RESPONSABILIDADE
 *   Exibir os chamados do solicitante logado num formato de cartão.
 *   Cada item, ao ser clicado, dispara `aoSelecionar(idChamado)`.
 *   Quem responde a esse clique (a página, hoje; o Controller, amanhã)
 *   é responsável por carregar os detalhes e abrir o modal.
 *
 * PRINCÍPIOS SOLID APLICADOS
 *   - SRP: só renderiza a lista.
 *   - ISP: a interface PropsListaMeusChamados expõe apenas o que
 *          essa lista realmente precisa.
 */
"use client";

import { Clock } from "lucide-react";
import type { ChamadoResumo } from "@/views/compartilhado/tipos-view";
import { Etiqueta, corPorStatus } from "@/views/compartilhado/Etiqueta";

interface PropsListaMeusChamados {
  chamados: ChamadoResumo[];
  /** Chamado pelo id quando o usuário clica em um item da lista. */
  aoSelecionar?: (idChamado: string) => void;
}

export function ListaMeusChamados({
  chamados,
  aoSelecionar,
}: PropsListaMeusChamados) {
  // Estado vazio — mostrado quando o solicitante não abriu nada.
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
