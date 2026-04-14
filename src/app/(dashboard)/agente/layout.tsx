/**
 * [V] LAYOUT: Dashboard do Agente
 * ARQUIVO: src/app/(dashboard)/agente/layout.tsx
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
      <div className="relative z-20 h-full flex-shrink-0 shadow-xl border-r border-slate-800">
        <BarraLateralAgente />
      </div>
      <div className="flex-1 overflow-y-auto relative z-10">
        {children}
      </div>
    </div>
  );
}
