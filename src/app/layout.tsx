/**
 * CAMADA: Infraestrutura — Layout Raiz da Aplicacao
 * ARQUIVO: src/app/layout.tsx
 *
 * DESCRICAO:
 *   Layout raiz que envolve TODAS as paginas do SupportBox.
 *   Configura o idioma (pt-BR), metadados globais e o provedor de tema.
 *   Nenhum conteudo visual e renderizado aqui — apenas a estrutura base.
 *
 * CONEXOES:
 *   - Depende de: ProvedorTema (alternancia claro/escuro), globals.css
 *   - Envolve: todas as paginas da aplicacao (login, solicitante, agente)
 */
import type { Metadata } from "next";
import { ProvedorTema } from "@/views/ui/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupportBox",
  description: "Sistema de Help Desk Corporativo",
};

export default function LayoutRaiz({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ProvedorTema attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ProvedorTema>
      </body>
    </html>
  );
}
