/**
 * Página /agente. Pega a lista de chamados de exemplo e passa para
 * o PainelAgente, junto com as funções de ação. Por enquanto as
 * funções só registram no console.
 */
"use client";

import { PainelAgente } from "@/views/agente/PainelAgente";
import {
  chamadosExemploAgente,
  detalhesExemploPorId,
} from "@/views/compartilhado/dados-de-exemplo";

export default function PaginaAgente() {
  return (
    <PainelAgente
      chamados={chamadosExemploAgente}
      obterDetalhes={(id) => detalhesExemploPorId[id] ?? null}
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
