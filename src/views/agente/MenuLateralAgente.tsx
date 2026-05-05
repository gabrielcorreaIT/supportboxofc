/**
 * Barra lateral fixa do agente.
 *
 * Aparece em todas as páginas do agente. Mostra o nome do sistema,
 * o atalho para o painel, a identificação do usuário entrado e o
 * botão para sair. O componente não sabe como o sistema desliga a
 * sessão. Ele apenas dispara a função recebida em aoSairClicado.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";

interface PropsMenuLateralAgente {
  nomeUsuario: string;
  aoSairClicado?: () => void;
}

export function MenuLateralAgente({
  nomeUsuario,
  aoSairClicado,
}: PropsMenuLateralAgente) {
  const caminho = usePathname();
  const ativo = caminho === "/agente";

  return (
    <aside className="w-60 bg-papel border-r border-linha flex flex-col h-screen">
      {/* Topo. Identidade do sistema. */}
      <div className="px-5 py-5 border-b border-linha">
        <h1 className="text-base font-semibold text-tinta">SupportBox</h1>
        <p className="text-xs text-tintaFraca">Área do agente</p>
      </div>

      {/* Atalhos. Por ora só temos o painel. Outros virão depois. */}
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

      {/* Rodapé. Usuário entrado e botão de sair. */}
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
