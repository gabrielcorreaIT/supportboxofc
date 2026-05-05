/**
 * CAMADA: View (rota Next.js — Layout Raiz)
 * ARQUIVO: src/app/layout.tsx
 *
 * RESPONSABILIDADE
 *   Layout raiz do App Router. Envolve TODAS as páginas com a tag
 *   <html>/<body>, importa o CSS global e define os metadados.
 *   Não renderiza nada de produto — só estrutura.
 *
 * ENCAIXE NO MVC FUTURO
 *   Este arquivo permanece estável. Se um dia precisarmos de um
 *   provedor global (tema, sessão), ele entra aqui — mas continua
 *   sendo apenas estrutura, sem lógica de negócio.
 */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupportBox",
  description: "Sistema de Help Desk — etapa de apresentação (View only).",
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
