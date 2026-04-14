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
