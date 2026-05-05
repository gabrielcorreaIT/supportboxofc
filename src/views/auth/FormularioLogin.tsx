/**
 * CAMADA: View — Tela de Login
 * ARQUIVO: src/views/auth/FormularioLogin.tsx
 *
 * RESPONSABILIDADE
 *   Apresentar o formulário de e-mail/senha e devolver os valores
 *   digitados ao chamador. Esta View NÃO sabe autenticar — apenas
 *   coleta as credenciais e dispara um callback.
 *
 * ENCAIXE NO MVC FUTURO
 *   Hoje, a página de login passa um callback de demonstração
 *   (que apenas redireciona). Quando o AuthController existir,
 *   o callback será `acaoLogin(email, senha)` e este componente
 *   continuará idêntico.
 *
 * PRINCÍPIOS SOLID APLICADOS
 *   - SRP: cuida só de coletar credenciais.
 *   - DIP: depende da prop `aoEnviar`, não de implementação concreta.
 */
"use client";

import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Botao } from "@/views/compartilhado/Botao";
import { CampoTexto } from "@/views/compartilhado/CampoTexto";

interface PropsFormularioLogin {
  /**
   * Disparado ao submeter o formulário. Recebe e-mail e senha já
   * limpos. Quem fornece o callback é responsável por autenticar
   * (Controller no futuro) e por redirecionar o usuário.
   */
  aoEnviar?: (email: string, senha: string) => void;

  /** Mensagem de erro vinda de fora (ex.: "credenciais inválidas"). */
  mensagemErro?: string | null;

  /** Marca o formulário como "carregando" (ex.: durante a chamada). */
  carregando?: boolean;
}

export function FormularioLogin({
  aoEnviar,
  mensagemErro,
  carregando = false,
}: PropsFormularioLogin) {
  // Estado interno do formulário.
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  /** Submete o formulário, repassando os valores ao callback externo. */
  const submeter = (e: React.FormEvent) => {
    e.preventDefault();
    aoEnviar?.(email.trim(), senha);
  };

  return (
    <form
      onSubmit={submeter}
      className="bg-papel border border-linha rounded-md p-6 w-full max-w-sm space-y-4"
    >
      <div>
        <h2 className="text-lg font-semibold text-tinta">Acessar o sistema</h2>
        <p className="text-sm text-tintaFraca">
          Use o e-mail corporativo cadastrado.
        </p>
      </div>

      {/* Aviso de erro (se houver). */}
      {mensagemErro && (
        <p
          role="alert"
          className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2"
        >
          {mensagemErro}
        </p>
      )}

      <CampoTexto
        rotulo="E-mail"
        type="email"
        placeholder="usuario@empresa.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={carregando}
        autoComplete="email"
      />

      {/* Senha com botão de mostrar/esconder. */}
      <div className="relative">
        <CampoTexto
          rotulo="Senha"
          type={mostrarSenha ? "text" : "password"}
          placeholder="********"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          disabled={carregando}
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={() => setMostrarSenha((m) => !m)}
          className="absolute right-2 top-[34px] p-1 text-tintaFraca hover:text-tinta"
          tabIndex={-1}
          aria-label={mostrarSenha ? "Esconder senha" : "Mostrar senha"}
        >
          {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <Botao
        type="submit"
        larguraTotal
        disabled={carregando || !email.trim() || !senha.trim()}
      >
        <LogIn className="w-4 h-4" /> {carregando ? "Entrando..." : "Entrar"}
      </Botao>
    </form>
  );
}
