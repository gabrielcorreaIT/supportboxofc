/**
 * Página /agente.
 *
 * Atua como casca da rota: pega os dados de exemplo do arquivo
 * compartilhado e os repassa para o componente PainelAgente, junto
 * com as funções que respondem às ações do usuário. Por enquanto
 * essas funções só registram no console, simulando o comportamento
 * que mais tarde vai chegar nos controladores.
 *
 * Manter a página curta é proposital: assim, quando os controladores
 * existirem, basta trocar a origem dos dados e as funções, sem
 * mexer no PainelAgente.
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
      // Devolve a versão completa de um chamado a partir do id, ou
      // null se o id não existir no mapa. No futuro, esta função
      // pode virar uma chamada assíncrona ao banco.
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
