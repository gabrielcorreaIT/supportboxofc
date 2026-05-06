/**
 * Página /solicitante. Pega os dados de exemplo e passa para o
 * PainelSolicitante, junto com as funções de ação. Por enquanto as
 * funções só registram no console.
 */
"use client";

import { useRouter } from "next/navigation";
import { PainelSolicitante } from "@/views/solicitante/PainelSolicitante";
import {
  chamadosExemploSolicitante,
  detalhesExemploPorId,
  usuarioSolicitanteExemplo,
} from "@/views/compartilhado/dados-de-exemplo";

export default function PaginaSolicitante() {
  const router = useRouter();

  return (
    <PainelSolicitante
      nomeUsuario={usuarioSolicitanteExemplo.nome}
      chamados={chamadosExemploSolicitante}
      obterDetalhes={(id) => detalhesExemploPorId[id] ?? null}
      aoSairClicado={() => router.push("/login")}
      aoCriarChamado={(dados) =>
        console.info("[apresentação] Novo chamado simulado:", dados)
      }
      aoComentar={(idChamado, texto) =>
        console.info("[apresentação] Comentário simulado:", { idChamado, texto })
      }
    />
  );
}
