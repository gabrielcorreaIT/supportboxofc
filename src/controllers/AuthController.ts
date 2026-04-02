/**
 * [C] CONTROLLER: AuthController (Server Actions)
 * ARQUIVO: src/controllers/AuthController.ts
 */
"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Autentica o usuario e persiste a sessao em cookies HttpOnly.
 * Retorna o role (solicitante | tecnico) para redirecionamento.
 */
export async function loginAction(
  email: string,
  password: string,
): Promise<{ success: boolean; role?: string; error?: string }> {
  if (!email || !EMAIL_REGEX.test(email.trim())) {
    return { success: false, error: "E-mail invalido." };
  }
  if (!password || password.length < 6) {
    return { success: false, error: "Senha invalida." };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      const mensagens: Record<string, string> = {
        "Invalid login credentials": "E-mail ou senha incorretos.",
        "Email not confirmed": "Confirme seu e-mail antes de acessar.",
        "Too many requests": "Muitas tentativas. Aguarde e tente novamente.",
      };
      return { success: false, error: mensagens[error.message] ?? "Falha na autenticacao." };
    }

    if (data.session) {
      const cookieStore = await cookies();
      const baseOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
      };

      cookieStore.set("sb-access-token", data.session.access_token, {
        ...baseOptions,
        maxAge: data.session.expires_in,
      });
      cookieStore.set("sb-refresh-token", data.session.refresh_token, {
        ...baseOptions,
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    const role = (data.user?.user_metadata?.role as string) ?? "solicitante";
    return { success: true, role };
  } catch (err) {
    console.error("Erro no AuthController:", err);
    return { success: false, error: "Erro interno de autenticacao." };
  }
}

/**
 * Retorna os dados do usuario autenticado a partir do JWT no cookie.
 * Decodifica o payload sem chamada de rede (Edge-compatible).
 */
export async function getCurrentUserAction(): Promise<{
  email: string;
  name: string;
  role: string;
} | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as {
      exp?: number;
      email?: string;
      user_metadata?: { name?: string; role?: string };
    };

    if (!payload.exp || payload.exp * 1000 < Date.now()) return null;

    return {
      email: payload.email ?? "",
      name: payload.user_metadata?.name ?? payload.email ?? "Usuario",
      role: payload.user_metadata?.role ?? "solicitante",
    };
  } catch {
    return null;
  }
}

export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("sb-access-token");
    cookieStore.delete("sb-refresh-token");
    await supabase.auth.signOut();
    return { success: true };
  } catch {
    return { success: false };
  }
}
