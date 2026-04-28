/**
 * CAMADA: View (Layout) — Dashboard do Solicitante
 * ARQUIVO: src/app/(dashboard)/solicitante/layout.tsx
 *
 * DESCRICAO:
 *   Layout que envolve as paginas do solicitante. Verifica se o usuario
 *   esta logado antes de renderizar; se nao estiver, redireciona para login.
 *
 * CONEXOES:
 *   - Depende de: AuthController (sessao)
 *   - Envolve: src/app/(dashboard)/solicitante/page.tsx
 */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { acaoObterUsuarioAtual } from "@/controllers/AuthController";

export const metadata: Metadata = {
  title: "SupportBox - Meus Chamados",
  description: "Portal do solicitante para abertura e acompanhamento de chamados",
};

export default async function SolicitanteLayout({ children }: { children: React.ReactNode }) {
  const usuario = await acaoObterUsuarioAtual();
  if (!usuario) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {children}
    </div>
  );
}
