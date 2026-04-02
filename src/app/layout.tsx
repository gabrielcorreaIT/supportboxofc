import type { Metadata } from "next";
import { ThemeProvider } from "@/views/ui/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupportBox",
  description: "Sistema de Help Desk Corporativo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
