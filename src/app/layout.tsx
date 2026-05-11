/**
 * Estrutura Molde HTML do site.
 *
 * Aqui fica a estrutura HTML básica do sistema, como a tag <html>, <body> e o conteúdo que é compartilhado em todas as páginas, como o menu de navegação. O conteúdo específico de cada página é inserido via parâmetro, no momento em que a rota é acessada.
 *
 *Exemplo: function LayoutRaiz({ children }) é uma função que recebe um parâmetro chamado children. O children é o conteúdo da página atual. Quando o usuário está em /login, o children é o conteúdo do login. Quando ele vai para /agente, o children vira o conteúdo do agente. O Next.js cuida de injetar a coisa certa.
 */

import type { Metadata } from "next";
import "./globals.css";

/**
 * Metadados da aba do navegador. Isso aqui gera o título que aparece na aba do navegador e a descrição que apareceria nos resultados de busca no Google.
 */
export const metadata: Metadata = {
  title: "SupportBox",
  description: "Sistema interno de atendimento de TI. Etapa visual.",
};

/**
 * Componente do layout raiz. Recebe via children o conteúdo da
 * rota que está sendo acessada e o coloca dentro de body.
 */
export default function LayoutRaiz({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
