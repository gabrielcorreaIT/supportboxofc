/**
 * Estrutura comum a todas as páginas dentro de /agente.
 *
 * Coloca a barra lateral fixa à esquerda e abre o restante da tela
 * para o conteúdo da rota filha. Como o painel do agente é a única
 * tela interna nesta etapa, o botão de sair leva de volta para a
 * tela de entrada.
 *
 * Quando a autenticação real existir, este é o lugar natural para
 * verificar a sessão do usuário e redirecionar caso ele não esteja
 * entrado. Por enquanto, o nome do usuário vem do arquivo de
 * dados de exemplo.
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
      {/*
        A área principal ocupa o espaço restante e tem rolagem
        própria. Assim a barra lateral permanece fixa enquanto o
        conteúdo do painel rola.
      */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
