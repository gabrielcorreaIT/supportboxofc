/**
 * Arquivo: layout.tsx
 * Projeto: SupportBox
 * * Descrição: Este é o Layout Raiz (Root Layout) do Next.js.
 * Ele funciona como o "esqueleto" principal de toda a aplicação. Tudo o que for
 * colocado aqui (como fontes, painéis de analytics ou o nosso Agente de IA)
 * vai aparecer em TODAS as páginas do sistema automaticamente, sem precisarmos
 * repetir o código.
 */

// =========================================================================
// 1. IMPORTAÇÕES (Dependências e Componentes)
// =========================================================================

import type { Metadata } from "next"; // Tipagem do Next.js para SEO e cabeçalhos da página
import { GeistSans } from "geist/font/sans"; // Fonte principal do projeto (sem serifa, moderna)
import { GeistMono } from "geist/font/mono"; // Fonte monoespaçada (ideal para códigos ou números de protocolo)
import { Analytics } from "@vercel/analytics/next"; // Ferramenta da Vercel para medir acessos e tráfego
import "./globals.css"; // Importação do arquivo que carrega o Tailwind e as cores base
import { ConditionalAIAgent } from "@/components/conditional-ai-agent"; // O nosso assistente virtual inteligente

// =========================================================================
// 2. METADADOS (SEO e Configurações do Navegador)
// =========================================================================

/**
 * O objeto 'metadata' dita o que vai aparecer na aba do navegador
 * e como o link do sistema vai aparecer se for compartilhado no WhatsApp/Slack.
 */
export const metadata: Metadata = {
  title: "SupportBox - Solicitante",
  description:
    "Sistema interno de abertura e acompanhamento de chamados de TI.",
};

// =========================================================================
// 3. COMPONENTE PRINCIPAL (RootLayout)
// =========================================================================

/**
 * RootLayout envolve todas as páginas do sistema.
 * @param children - Representa o conteúdo específico de cada página (ex: a tela de Login ou o Dashboard).
 * Quando o usuário muda de rota, apenas o 'children' muda; o resto (como o Botão do IA) permanece intacto.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 'lang="pt-BR"': Essencial para Acessibilidade (Leitores de tela) e para o Chrome não ficar pedindo para traduzir a página.
    // 'suppressHydrationWarning': Evita alertas de erro no console caso alguma extensão do navegador modifique o HTML antes do React carregar.
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        // Injetamos as variáveis das fontes Geist e aplicamos 'antialiased' para deixar as letras mais nítidas e suaves nas telas.
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {/* Aqui é onde o Next.js vai "injetar" as suas telas (page.tsx) */}
        {children}

        {/* Monitoramento de acessos da Vercel rodando de forma invisível no fundo */}
        <Analytics />

        {/* Nosso Agente de IA flutuante. Como está no Layout, ele vai acompanhar o usuário em qualquer página que ele navegar! */}
        <ConditionalAIAgent />
      </body>
    </html>
  );
}
