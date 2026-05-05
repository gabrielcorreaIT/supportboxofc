/**
 * Página do portal do solicitante.
 *
 * Atua como casca da rota /solicitante. Pega os dados de exemplo e
 * as funções de ação e passa tudo para o componente
 * PainelSolicitante.
 *
 * Quando os controladores existirem, esta página vai chamar as
 * ações reais de listagem, criação e comentário, e repassar os
 * resultados como hoje. O painel em si não muda.
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
