/**
 * CAMADA: Controller — Autenticacao
 * ARQUIVO: src/controllers/AuthController.ts
 *
 * DESCRICAO:
 *   Gerencia login, logout e identificacao do usuario logado.
 *   Apos autenticar no Supabase, guarda os dados do usuario em um
 *   cookie simples (JSON) para manter a sessao entre paginas.
 *
 * CONEXOES:
 *   - Depende de: supabase.ts (autenticacao), cookies do Next.js
 *   - Usado por:  LoginForm, AgentSidebar, SolicitanteDashboard, layouts
 */
"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

const COOKIE_USUARIO = "supportbox-usuario";
const SETE_DIAS = 60 * 60 * 24 * 7;

export interface UsuarioLogado {
  email: string;
  nome: string;
  papel: string;
}

/** Autentica no Supabase e salva o usuario no cookie. */
export async function acaoLogin(
  email: string,
  senha: string,
): Promise<{ sucesso: boolean; papel?: string; erro?: string }> {
  if (!email.trim() || !senha) {
    return { sucesso: false, erro: "Preencha e-mail e senha." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: senha,
  });

  if (error || !data.user) {
    return { sucesso: false, erro: "E-mail ou senha incorretos." };
  }

  const usuario: UsuarioLogado = {
    email: data.user.email ?? "",
    nome: (data.user.user_metadata?.name as string) ?? data.user.email ?? "Usuario",
    papel: (data.user.user_metadata?.role as string) ?? "solicitante",
  };

  const armazenCookies = await cookies();
  armazenCookies.set(COOKIE_USUARIO, JSON.stringify(usuario), {
    path: "/",
    maxAge: SETE_DIAS,
  });

  return { sucesso: true, papel: usuario.papel };
}

/** Le os dados do usuario logado a partir do cookie. */
export async function acaoObterUsuarioAtual(): Promise<UsuarioLogado | null> {
  const armazenCookies = await cookies();
  const valor = armazenCookies.get(COOKIE_USUARIO)?.value;
  if (!valor) return null;

  try {
    return JSON.parse(valor) as UsuarioLogado;
  } catch {
    return null;
  }
}

/** Encerra a sessao removendo o cookie. */
export async function acaoLogout(): Promise<{ sucesso: boolean }> {
  const armazenCookies = await cookies();
  armazenCookies.delete(COOKIE_USUARIO);
  return { sucesso: true };
}
