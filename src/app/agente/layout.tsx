/**
 * CAMADA: View (rota Next.js — Layout do Agente)
 * ARQUIVO: src/app/agente/layout.tsx
 *
 * RESPONSABILIDADE
 *   Layout aplicado a todas as páginas dentro de "/agente".
 *   Renderiza a barra lateral fixa à esquerda e abre espaço, à
 *   direita, para o conteúdo das rotas filhas.
 *
 *   Como o painel do agente é a única página "logada" desta etapa,
 *   o callback de "Sair" também leva ao /login. Quando houver
 *   AuthController, a chamada `acaoLogout()` virá para cá.
 */
"use client";

import { useRouter } from "next/navigation";
import { MenuLateralAgente } from "@/views/agente/MenuLateralAgente";
import { usuarioAgenteFake } from "@/views/compartilhado/dados-mock";

export default function LayoutAgente({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="flex h-screen overflow-hidden bg-fundo">
      <MenuLateralAgente
        nomeUsuario={usuarioAgenteFake.nome}
        aoSairClicado={() => router.push("/login")}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
