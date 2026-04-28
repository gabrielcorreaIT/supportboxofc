/**
 * CAMADA: View (Layout) — Dashboard do Agente de TI
 * ARQUIVO: src/app/(dashboard)/agente/layout.tsx
 *
 * DESCRICAO:
 *   Layout que envolve as paginas do painel do agente. Verifica se o
 *   usuario esta logado antes de renderizar; se nao estiver, redireciona
 *   para a pagina de login.
 *
 * CONEXOES:
 *   - Depende de: AuthController (sessao), BarraLateralAgente (menu lateral)
 *   - Envolve: src/app/(dashboard)/agente/page.tsx
 */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { acaoObterUsuarioAtual } from "@/controllers/AuthController";
import { BarraLateralAgente } from "@/views/ticket/AgentSidebar";

export const metadata: Metadata = {
  title: "SupportBox - Agentes",
  description: "Painel de controle para a equipe de TI",
};

export default async function LayoutAgente({ children }: { children: React.ReactNode }) {
  const usuario = await acaoObterUsuarioAtual();
  if (!usuario) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 relative">
      <div className="relative z-20 h-full flex-shrink-0 shadow-xl border-r border-slate-800">
        <BarraLateralAgente />
      </div>
      <div className="flex-1 overflow-y-auto relative z-10">
        {children}
      </div>
    </div>
  );
}
