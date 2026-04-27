/**
 * CAMADA: Controller — Autenticacao
 * ARQUIVO: src/controllers/AuthController.ts
 *
 * DESCRICAO:
 *   Gerencia login, logout e identificacao do usuario logado.
 *   Usa "Server Actions" do Next.js — ou seja, estas funcoes rodam
 *   exclusivamente no servidor, mesmo sendo chamadas pelo navegador.
 *   Isso garante que tokens e credenciais nunca fiquem expostos.
 *
 * CONEXOES:
 *   - Depende de: supabase.ts (autenticacao no banco), cookies do Next.js
 *   - Usado por:  LoginForm (login), AgentSidebar e SolicitanteDashboard (usuario/logout)
 *
 * FLUXO DE LOGIN:
 *   1. View chama acaoLogin(email, senha)
 *   2. Controller valida os campos e autentica no Supabase
 *   3. Salva os tokens em cookies HttpOnly (seguro contra XSS)
 *   4. Retorna o papel ("solicitante" ou "tecnico") para a View redirecionar
 */
"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

/** Expressao regular para validar formato basico de e-mail. */
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Autentica o usuario e cria a sessao.
 *
 * @param email - E-mail corporativo do usuario
 * @param senha - Senha do usuario (minimo 6 caracteres)
 * @returns Objeto com sucesso/erro e o papel do usuario (solicitante ou tecnico)
 */
export async function acaoLogin(
  email: string,
  senha: string,
): Promise<{ sucesso: boolean; papel?: string; erro?: string }> {
  // Validacao dos campos de entrada
  if (!email || !REGEX_EMAIL.test(email.trim())) {
    return { sucesso: false, erro: "E-mail invalido." };
  }
  if (!senha || senha.length < 6) {
    return { sucesso: false, erro: "Senha invalida." };
  }

  try {
    // Tenta autenticar no Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    });

    if (error) {
      // Traduz mensagens de erro do Supabase para portugues
      const mensagens: Record<string, string> = {
        "Invalid login credentials": "E-mail ou senha incorretos.",
        "Email not confirmed": "Confirme seu e-mail antes de acessar.",
        "Too many requests": "Muitas tentativas. Aguarde e tente novamente.",
      };
      return { sucesso: false, erro: mensagens[error.message] ?? "Falha na autenticacao." };
    }

    // Salva os tokens JWT em cookies HttpOnly para manter a sessao
    if (data.session) {
      const armazenCookies = await cookies();
      const opcoesBase = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
      };

      armazenCookies.set("sb-access-token", data.session.access_token, {
        ...opcoesBase,
        maxAge: data.session.expires_in,
      });
      armazenCookies.set("sb-refresh-token", data.session.refresh_token, {
        ...opcoesBase,
        maxAge: 60 * 60 * 24 * 30, // 30 dias
      });
    }

    // Extrai o papel do usuario dos metadados do Supabase
    const papel = (data.user?.user_metadata?.role as string) ?? "solicitante";
    return { sucesso: true, papel };
  } catch (err) {
    console.error("Erro no AuthController:", err);
    return { sucesso: false, erro: "Erro interno de autenticacao." };
  }
}

/**
 * Retorna os dados do usuario logado a partir do JWT armazenado no cookie.
 * Decodifica o token localmente sem fazer chamada de rede, tornando
 * a funcao rapida e compativel com Edge Runtime.
 *
 * @returns Dados do usuario (email, nome, papel) ou null se nao estiver logado
 */
export async function acaoObterUsuarioAtual(): Promise<{
  email: string;
  nome: string;
  papel: string;
} | null> {
  try {
    const armazenCookies = await cookies();
    const token = armazenCookies.get("sb-access-token")?.value;
    if (!token) return null;

    // Decodifica o payload do JWT (parte do meio, entre os dois pontos)
    const partes = token.split(".");
    if (partes.length !== 3) return null;

    const base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as {
      exp?: number;
      email?: string;
      user_metadata?: { name?: string; role?: string };
    };

    // Verifica se o token nao expirou
    if (!payload.exp || payload.exp * 1000 < Date.now()) return null;

    return {
      email: payload.email ?? "",
      nome: payload.user_metadata?.name ?? payload.email ?? "Usuario",
      papel: payload.user_metadata?.role ?? "solicitante",
    };
  } catch {
    return null;
  }
}

/**
 * Encerra a sessao do usuario: remove os cookies e faz signOut no Supabase.
 */
export async function acaoLogout(): Promise<{ sucesso: boolean }> {
  try {
    const armazenCookies = await cookies();
    armazenCookies.delete("sb-access-token");
    armazenCookies.delete("sb-refresh-token");
    await supabase.auth.signOut();
    return { sucesso: true };
  } catch {
    return { sucesso: false };
  }
}
