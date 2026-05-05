/**
 * CAMADA: View (rota Next.js — Página do Agente)
 * ARQUIVO: src/app/agente/page.tsx
 *
 * RESPONSABILIDADE
 *   "Casca" da página /agente. Injeta a lista (mock) e os callbacks
 *   no PainelAgente. Os callbacks aqui apenas registram no console;
 *   futuramente, virarão chamadas a `acaoAtribuirChamado`,
 *   `acaoConcluirChamado`, etc.
 */
"use client";

import { PainelAgente } from "@/views/agente/PainelAgente";
import {
  chamadosFakeAgente,
  detalhesFakePorId,
} from "@/views/compartilhado/dados-mock";

export default function PaginaAgente() {
  return (
    <PainelAgente
      chamados={chamadosFakeAgente}
      obterDetalhes={(id) => detalhesFakePorId[id] ?? null}
      aoAssumir={(id) =>
        console.info("[apresentação] Chamado assumido (simulado):", id)
      }
      aoConcluir={(id) =>
        console.info("[apresentação] Chamado concluído (simulado):", id)
      }
      aoComentar={(id, texto) =>
        console.info("[apresentação] Comentário simulado:", { id, texto })
      }
    />
  );
}
