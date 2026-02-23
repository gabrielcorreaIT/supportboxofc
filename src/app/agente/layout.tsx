/**
 * ============================================================================
 * COMPONENTE: AgenteLayout (Layout Exclusivo do Setor de TI)
 * PROJETO: SupportBox
 * ============================================================================
 * * DESCRIÇÃO:
 * Este arquivo define o "esqueleto" e as configurações globais específicas
 * para todas as páginas dentro da rota `/agente`.
 * * * ARQUITETURA:
 * No Next.js (App Router), um arquivo `layout.tsx` aninhado permite sobrescrever
 * configurações do layout principal (raiz) sem afetar o resto do sistema.
 * É graças a este arquivo que a aba do navegador exibe "SupportBox - Agentes"
 * aqui, enquanto na tela de abertura de chamados exibe "SupportBox - Solicitante".
 */

import type { Metadata } from "next";

/**
 * Objeto de Metadados:
 * Altera as informações da tag <head> do HTML, mudando o título da aba do
 * navegador e a descrição da página para os motores de busca (SEO).
 */
export const metadata: Metadata = {
  title: "SupportBox - Agentes",
  description: "Painel de controle para a equipe de TI",
};

/**
 * Função Principal do Layout:
 * @param children - Representa o conteúdo da página atual (neste caso, o `page.tsx`
 * do AgenteDashboard) que será "injetado" dentro deste layout.
 */
export default function AgenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Como o visual (Sidebar e fundo) já foi construído direto na page.tsx,
  // este layout atua apenas como um "wrapper" invisível para aplicar os metadados.
  return <>{children}</>;
}
