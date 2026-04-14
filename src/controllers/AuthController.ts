/**
 * [C] CONTROLLER: AuthController (Server Actions)
 * ARQUIVO: src/controllers/AuthController.ts
 */
"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Autentica o usuario e persiste a sessao em cookies HttpOnly.
 * Retorna o role (solicitante | tecnico) para redirecionamento.
 */
export async function acaoLogin(
  email: string,
  senha: string,
): Promise<{ sucesso: boolean; papel?: string; erro?: string }> {
  if (!email || !REGEX_EMAIL.test(email.trim())) {
    return { sucesso: false, erro: "E-mail invalido." };
  }
  if (!senha || senha.length < 6) {
    return { sucesso: false, erro: "Senha invalida." };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    });

    if (error) {
      const mensagens: Record<string, string> = {
        "Invalid login credentials": "E-mail ou senha incorretos.",
        "Email not confirmed": "Confirme seu e-mail antes de acessar.",
        "Too many requests": "Muitas tentativas. Aguarde e tente novamente.",
      };
      return { sucesso: false, erro: mensagens[error.message] ?? "Falha na autenticacao." };
    }

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
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    const papel = (data.user?.user_metadata?.role as string) ?? "solicitante";
    return { sucesso: true, papel };
  } catch (err) {
    console.error("Erro no AuthController:", err);
    return { sucesso: false, erro: "Erro interno de autenticacao." };
  }
}

/**
 * Retorna os dados do usuario autenticado a partir do JWT no cookie.
 * Decodifica o payload sem chamada de rede (Edge-compatible).
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

    const partes = token.split(".");
    if (partes.length !== 3) return null;

    const base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as {
      exp?: number;
      email?: string;
      user_metadata?: { name?: string; role?: string };
    };

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
