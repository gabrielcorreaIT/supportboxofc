/**
 * CAMADA: View — Provedor de Tema (Claro/Escuro)
 * ARQUIVO: src/views/ui/theme-provider.tsx
 *
 * DESCRICAO:
 *   Wrapper sobre a biblioteca "next-themes" que permite alternar
 *   entre tema claro e escuro no sistema. Envolve toda a aplicacao
 *   no layout raiz (src/app/layout.tsx).
 *
 * CONEXOES:
 *   - Depende de: next-themes (biblioteca externa)
 *   - Usado por:  src/app/layout.tsx (layout raiz da aplicacao)
 */
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

export function ProvedorTema({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
