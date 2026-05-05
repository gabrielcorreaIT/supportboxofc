/**
 * CAMADA: View (rota Next.js — Página do Solicitante)
 * ARQUIVO: src/app/solicitante/page.tsx
 *
 * RESPONSABILIDADE
 *   "Casca" da página /solicitante. Sua única função aqui é INJETAR
 *   os dados (mock, nesta etapa) e os callbacks (no-op) no
 *   componente PainelSolicitante.
 *
 *   Quando os Controllers existirem, esta página passará a chamar
 *   `acaoListarMeusChamados()`, `acaoCriarChamado(...)`, etc., e
 *   repassará as funções resultantes para o painel. O painel em si
 *   permanece inalterado — princípio DIP do SOLID em ação.
 */
"use client";

import { useRouter } from "next/navigation";
import { PainelSolicitante } from "@/views/solicitante/PainelSolicitante";
import {
  chamadosFakeSolicitante,
  detalhesFakePorId,
  usuarioSolicitanteFake,
} from "@/views/compartilhado/dados-mock";

export default function PaginaSolicitante() {
  const router = useRouter();

  return (
    <PainelSolicitante
      nomeUsuario={usuarioSolicitanteFake.nome}
      chamados={chamadosFakeSolicitante}
      // Função síncrona de demonstração: lê do mock por id.
      // No futuro: `await acaoObterDetalhes(id)`.
      obterDetalhes={(id) => detalhesFakePorId[id] ?? null}
      // Sair: sem AuthController, basta voltar para /login.
      aoSairClicado={() => router.push("/login")}
      // Os dois callbacks abaixo serão preenchidos quando os
      // Controllers existirem. Por enquanto, são placeholders.
      aoCriarChamado={(dados) =>
        console.info("[apresentação] Novo chamado simulado:", dados)
      }
      aoComentar={(idChamado, texto) =>
        console.info("[apresentação] Comentário simulado:", { idChamado, texto })
      }
    />
  );
}
