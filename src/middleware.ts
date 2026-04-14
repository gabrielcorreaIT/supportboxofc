/**
 * MIDDLEWARE: Protecao de Rotas (Auth Guard)
 * ARQUIVO: src/middleware.ts
 *
 * Intercepta requisicoes para rotas protegidas e valida o JWT
 * no cookie. Redireciona para /login se a sessao for invalida.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function jwtExpirado(token: string): boolean {
  try {
    const partes = token.split(".");
    if (partes.length !== 3) return true;
    const base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as { exp?: number };
    return !payload.exp || payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function middleware(requisicao: NextRequest): NextResponse {
  const tokenAcesso = requisicao.cookies.get("sb-access-token")?.value;

  if (!tokenAcesso || jwtExpirado(tokenAcesso)) {
    const urlLogin = new URL("/login", requisicao.url);
    return NextResponse.redirect(urlLogin);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/agente/:path*", "/solicitante/:path*"],
};
