/**
 * ============================================================================
 * 📦 COMPONENTE: AgenteLayout (Layout Exclusivo do Setor de TI)
 * 💻 PROJETO: SupportBox
 * 👨‍💻 DESENVOLVEDOR: Gabriel
 * ============================================================================
 * 📝 DESCRIÇÃO:
 * Este é o "esqueleto" mestre de todas as páginas do Agente.
 * Ele carrega a nossa AgentSidebar fixa na esquerda e injeta o conteúdo
 * da página atual (children) no lado direito. Isso garante que a barra
 * lateral nunca pisque ou recarregue ao navegar entre as abas!
 * ============================================================================
 */

import type { Metadata } from "next";
// Importamos o componente inteligente da barra lateral
import { AgentSidebar } from "@/components/AgentSidebar";

export const metadata: Metadata = {
  title: "SupportBox - Agentes",
  description: "Painel de controle e fila de atendimento para a equipe de TI",
};

export default function AgenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 relative">
      {/* Fundo com textura pontilhada elegante */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* 1. A NOSSA BARRA LATERAL INTELIGENTE FIXA AQUI */}
      {/* ⚠️ CORREÇÃO: O wrapper z-20 e flex-shrink-0 garante que a barra fique sempre na frente e seja clicável! */}
      <div className="relative z-20 h-full flex-shrink-0 shadow-xl border-r border-slate-800">
        <AgentSidebar />
      </div>

      {/* 2. O CONTEÚDO DINÂMICO (As suas páginas) VAI AQUI DENTRO */}
      <div className="flex-1 overflow-y-auto relative z-10">{children}</div>
    </div>
  );
}
