/**
 * CAMADA: View (Layout) — Dashboard do Agente de TI
 * ARQUIVO: src/app/(dashboard)/agente/layout.tsx
 *
 * DESCRICAO:
 *   Layout que envolve todas as paginas do painel do agente.
 *   Exibe a barra lateral fixa (AgentSidebar) e uma area de conteudo
 *   rolavel onde as paginas sao renderizadas.
 *
 * CONEXOES:
 *   - Depende de: BarraLateralAgente (menu lateral)
 *   - Envolve: src/app/(dashboard)/agente/page.tsx (e futuras sub-paginas)
 */
import type { Metadata } from "next";
import { BarraLateralAgente } from "@/views/ticket/AgentSidebar";

export const metadata: Metadata = {
  title: "SupportBox - Agentes",
  description: "Painel de controle para a equipe de TI",
};

export default function LayoutAgente({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 relative">
      {/* Barra lateral fixa */}
      <div className="relative z-20 h-full flex-shrink-0 shadow-xl border-r border-slate-800">
        <BarraLateralAgente />
      </div>
      {/* Area de conteudo principal (rolavel) */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {children}
      </div>
    </div>
  );
}
