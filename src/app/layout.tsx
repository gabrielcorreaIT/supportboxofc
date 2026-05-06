/**
 * Estrutura raiz do site.
 *
 * Este é o layout que envolve todas as rotas do projeto. Ele
 * define as tags html e body, importa o CSS global e configura os
 * metadados que aparecem na aba do navegador. Não desenha nada do
 * sistema em si, só a moldura que sustenta o conteúdo das páginas.
 *
 * Quando os controladores e os modelos forem adicionados nas
 * próximas etapas, este arquivo continua igual. Se um dia
 * precisarmos de algo global, como um tema ou a sessão do usuário,
 * é aqui que esses recursos entram, sem mexer no resto do projeto.
 */
import type { Metadata } from "next";
import "./globals.css";

/**
 * Metadados da aba do navegador. O Next.js lê este objeto e gera
 * automaticamente as tags <title> e <meta> equivalentes.
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
