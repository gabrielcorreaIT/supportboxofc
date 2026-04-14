/**
 * ============================================================================
 * [V] VIEW: ProvedorTema
 * ARQUIVO: src/views/ui/theme-provider.tsx
 * ============================================================================
 */
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

export function ProvedorTema({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
