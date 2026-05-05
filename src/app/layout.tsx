/**
 * Estrutura raiz do site.
 *
 * Envolve todas as páginas com as tags html e body, carrega o estilo
 * global e define o título exibido na aba do navegador. Aqui não
 * temos nada do sistema em si, apenas a moldura.
 *
 * Quando os controladores e modelos forem adicionados nas próximas
 * etapas, esse arquivo continua igual. Se um dia precisar de algo
 * global, como tema ou sessão de usuário, é aqui que entra.
 */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupportBox",
  description: "Sistema interno de atendimento de TI. Etapa visual.",
};

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
