/**
 * Página do painel do agente.
 *
 * Atua como casca da rota /agente. Pega a lista de chamados de
 * exemplo e as funções de ação e passa tudo para o componente
 * PainelAgente. As funções por enquanto só registram no console.
 * Quando os controladores existirem, é aqui que entram as ações de
 * verdade, sem precisar mexer no painel.
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
