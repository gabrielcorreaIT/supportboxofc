/**
 * Estrutura usada por todas as páginas do agente.
 *
 * Coloca a barra lateral fixa à esquerda e deixa o resto do espaço
 * para o conteúdo da página. Como o painel do agente é a única tela
 * dentro de uma sessão nesta etapa, o botão de sair leva de volta
 * para a tela de entrada.
 */
"use client";

import { useRouter } from "next/navigation";
import { MenuLateralAgente } from "@/views/agente/MenuLateralAgente";
import { usuarioAgenteExemplo } from "@/views/compartilhado/dados-de-exemplo";

export default function LayoutAgente({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="flex h-screen overflow-hidden bg-fundo">
      <MenuLateralAgente
        nomeUsuario={usuarioAgenteExemplo.nome}
        aoSairClicado={() => router.push("/login")}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
