/**
 * CAMADA: Infraestrutura — Protecao de Rotas (Auth Guard)
 * ARQUIVO: src/middleware.ts
 *
 * DESCRICAO:
 *   Intercepta todas as requisicoes para rotas protegidas (/agente/*
 *   e /solicitante/*) e verifica se o usuario possui um JWT valido
 *   no cookie. Se o token nao existir ou estiver expirado, redireciona
 *   automaticamente para a pagina de login.
 *
 *   Este middleware roda no Edge Runtime do Next.js — ou seja, executa
 *   antes mesmo da pagina comecar a ser renderizada, garantindo que
 *   usuarios nao autenticados nunca vejam conteudo protegido.
 *
 * CONEXOES:
 *   - Nao depende de outros arquivos do projeto (auto-contido)
 *   - Configurado em: config.matcher (define quais rotas proteger)
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Verifica se um JWT esta expirado analisando o campo "exp" do payload.
 * Decodifica apenas o payload (parte do meio) sem validar a assinatura,
 * pois aqui o objetivo e apenas checar a expiracao — a validacao completa
 * acontece no Supabase quando uma acao e executada.
 */
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

/** Middleware principal: verifica autenticacao nas rotas protegidas. */
export function middleware(requisicao: NextRequest): NextResponse {
  const tokenAcesso = requisicao.cookies.get("sb-access-token")?.value;

  if (!tokenAcesso || jwtExpirado(tokenAcesso)) {
    const urlLogin = new URL("/login", requisicao.url);
    return NextResponse.redirect(urlLogin);
  }

  return NextResponse.next();
}

/** Define quais rotas sao protegidas por este middleware. */
export const config = {
  matcher: ["/agente/:path*", "/solicitante/:path*"],
};
