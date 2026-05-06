/**
 * Barra lateral fixa usada nas páginas do agente.
 *
 * Aparece à esquerda em todas as rotas dentro de /agente. Mostra
 * a identidade do sistema, os atalhos de navegação, a identificação
 * do usuário entrado e o botão de sair. Por enquanto a navegação
 * tem só o item Painel, mas a estrutura já está pronta para receber
 * outros atalhos quando o sistema crescer.
 *
 * O componente não sabe como o sistema desliga a sessão. Ele só
 * dispara aoSairClicado e deixa a decisão para quem o utiliza.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";

interface PropsMenuLateralAgente {
  /** Nome do usuário entrado, exibido no rodapé da barra. */
  nomeUsuario: string;
  /** Função chamada quando o usuário aperta Sair. */
  aoSairClicado?: () => void;
}

export function MenuLateralAgente({
  nomeUsuario,
  aoSairClicado,
}: PropsMenuLateralAgente) {
  // O hook usePathname devolve a rota atual. Usamos para destacar
  // visualmente o atalho que corresponde à página em que o agente
  // está agora.
  const caminho = usePathname();
  const ativo = caminho === "/agente";

  return (
    <aside className="w-60 bg-papel border-r border-linha flex flex-col h-screen">
      {/*
        Topo da barra com o nome do sistema e a identificação da
        área. A divisória inferior separa o cabeçalho dos atalhos.
      */}
      <div className="px-5 py-5 border-b border-linha">
        <h1 className="text-base font-semibold text-tinta">SupportBox</h1>
        <p className="text-xs text-tintaFraca">Área do agente</p>
      </div>

      {/*
        Lista de atalhos de navegação. O item ativo recebe um
        destaque visual usando o tom de marca, enquanto os demais
        ficam discretos.
      */}
      <nav className="flex-1 p-3">
        <Link
          href="/agente"
          className={[
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
            ativo
              ? "bg-marca-fraca text-marca-forte font-medium"
              : "text-tintaFraca hover:bg-fundo",
          ].join(" ")}
        >
          <LayoutDashboard className="w-4 h-4" />
          Painel
        </Link>
      </nav>

      {/*
        Rodapé da barra com a identificação do usuário e o botão
        Sair logo abaixo.
      */}
      <div className="p-3 border-t border-linha space-y-2">
        <div className="px-3 py-2 rounded-md bg-fundo border border-linha">
          <p className="text-sm font-medium text-tinta">{nomeUsuario}</p>
          <p className="text-xs text-tintaFraca">Agente de TI</p>
        </div>
        <button
          onClick={aoSairClicado}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-tintaFraca hover:bg-fundo"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
