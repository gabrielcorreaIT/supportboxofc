/**
 * ============================================================================
 * COMPONENTE: ConditionalAIAgent (Wrapper de Renderização Condicional)
 * PROJETO: SupportBox (Plataforma ITSM "AI-First")
 * ============================================================================
 * * 📝 RESUMO TÉCNICO:
 * Este componente atua como um "Embrulho" (Wrapper) inteligente para o widget
 * do Agente de IA (Google Gemini). Em vez de renderizar o robô cegamente em
 * todas as telas do sistema, este componente "escuta" a URL atual do usuário
 * e decide se o robô deve ou não ser exibido na tela.
 * * * 🎯 OBJETIVO DE NEGÓCIO E UX:
 * 1. Ocultar o chatbot em telas de autenticação (Login), evitando distrações
 * antes do usuário entrar no sistema.
 * 2. Ocultar o chatbot no painel exclusivo da equipe de TI (/agente), pois
 * os técnicos não precisam da triagem de Nível 0 para trabalhar.
 * * * ⚙️ ARQUITETURA (Next.js App Router):
 * Utiliza o hook `usePathname` (Client Component) para ler a rota ativa. Se
 * a rota for bloqueada, retorna `null` (não renderiza nada, economizando
 * memória do navegador). Caso contrário, renderiza o `<AIAgent />` normal.
 * ============================================================================
 */

"use client"; // Obrigatório no Next.js pois 'usePathname' precisa rodar no navegador do cliente

import { usePathname } from "next/navigation";
import { AIAgent } from "@/components/AIAgent"; // O seu componente original do robô flutuante

export function ConditionalAIAgent() {
  // =========================================================================
  // 1. LEITURA DE CONTEXTO (ROTAS)
  // =========================================================================

  // Hook do Next.js que captura o caminho (URL) atual do usuário em tempo real
  const pathname = usePathname();

  // =========================================================================
  // 2. REGRAS DE NEGÓCIO (BLACKLIST DE TELAS)
  // =========================================================================

  /**
   * isLoginScreen: Retorna 'true' se o usuário estiver na raiz do site ("/")
   * ou em qualquer rota que contenha a palavra "login" (ex: /loginagente).
   */
  const isLoginScreen = pathname === "/" || pathname?.includes("/login");

  /**
   * isAgentScreen: Retorna 'true' se o usuário estiver no painel de trabalho
   * da equipe de TI (ex: /agente, /agente/configuracoes).
   */
  const isAgentScreen = pathname?.includes("/agente");

  // =========================================================================
  // 3. RENDERIZAÇÃO CONDICIONAL
  // =========================================================================

  // Se a tela atual estiver nas regras de bloqueio, "matamos" a renderização aqui
  if (isLoginScreen || isAgentScreen) {
    return null; // Oculta o robô completamente e libera processamento
  }

  // Se passou pelos filtros (ex: está no "/dashboard" do Solicitante), exibe o robô
  return <AIAgent />;
}
