/**
 * Página /solicitante.
 *
 * Funciona como casca da rota: pega os dados de exemplo e as
 * funções de ação e entrega tudo ao PainelSolicitante. Por enquanto
 * as funções só registram no console, simulando o comportamento que
 * a camada de regras vai trazer mais tarde.
 *
 * Quando os controladores existirem, esta página passa a chamar as
 * ações reais (criar chamado, listar, comentar) e a repassar os
 * resultados ao painel pelas mesmas props que já existem hoje. O
 * componente em si não muda.
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
      // Devolve a versão completa de um chamado a partir do id.
      // Síncrono nesta etapa porque os dados são de exemplo. Pode
      // virar uma chamada assíncrona quando o banco existir.
      obterDetalhes={(id) => detalhesExemploPorId[id] ?? null}
      // Sem autenticação real, sair simplesmente volta para a
      // tela de entrada.
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
