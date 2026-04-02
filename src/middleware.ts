/**
 * MIDDLEWARE: Protecao de Rotas (Auth Guard)
 * ARQUIVO: src/middleware.ts
 *
 * Intercepta requisicoes para rotas protegidas e valida o JWT
 * no cookie. Redireciona para /login se a sessao for invalida.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isJwtExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as { exp?: number };
    return !payload.exp || payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest): NextResponse {
  const accessToken = request.cookies.get("sb-access-token")?.value;

  if (!accessToken || isJwtExpired(accessToken)) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/agente/:path*", "/solicitante/:path*"],
};
