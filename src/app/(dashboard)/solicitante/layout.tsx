/**
 * [V] LAYOUT: Dashboard do Solicitante
 * ARQUIVO: src/app/(dashboard)/solicitante/layout.tsx
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SupportBox - Meus Chamados",
  description: "Portal do solicitante para abertura e acompanhamento de chamados",
};

export default function SolicitanteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {children}
    </div>
  );
}
