/**
 * CAMADA: View (Layout) — Dashboard do Solicitante
 * ARQUIVO: src/app/(dashboard)/solicitante/layout.tsx
 *
 * DESCRICAO:
 *   Layout simples que envolve as paginas do solicitante.
 *   Aplica apenas o fundo (bg) padrao. O header e a navegacao
 *   ficam dentro do PainelSolicitante.
 *
 * CONEXOES:
 *   - Envolve: src/app/(dashboard)/solicitante/page.tsx
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
