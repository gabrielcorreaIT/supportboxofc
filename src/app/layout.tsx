/**
 * Estrutura raiz do site. Envolve todas as páginas com html e body,
 * carrega o estilo global e define o título da aba do navegador.
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
