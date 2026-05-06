/**
 * Estrutura comum às páginas do agente. Coloca a barra lateral fixa
 * à esquerda e deixa o resto do espaço para o conteúdo.
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
