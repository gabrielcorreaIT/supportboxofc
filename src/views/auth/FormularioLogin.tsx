/**
 * Formulário de entrada do sistema.
 *
 * Apresenta os campos de e-mail e senha em uma caixa simples e
 * dispara aoEnviar com os valores digitados. O formulário não sabe
 * validar o acesso por conta própria. Quem usa o componente recebe
 * os dados e decide o que fazer.
 *
 * Hoje, a página de entrada usa esse retorno só para escolher o
 * destino com base no e-mail. Quando a parte de autenticação for
 * adicionada, a função recebida em aoEnviar passa a fazer a
 * validação real e nada deste arquivo precisa mudar.
 */
"use client";

import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Botao } from "@/views/compartilhado/Botao";
import { CampoTexto } from "@/views/compartilhado/CampoTexto";

interface PropsFormularioLogin {
  /**
   * Função chamada quando o formulário é enviado. Recebe e-mail
   * já com espaços removidos das pontas, e a senha exatamente
   * como digitada.
   */
  aoEnviar?: (email: string, senha: string) => void;
}

export function FormularioLogin({ aoEnviar }: PropsFormularioLogin) {
  // Estado interno dos campos.
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  // Controla se a senha aparece em texto claro ou em pontos. Ajuda
  // o usuário a conferir o que digitou sem precisar apagar tudo.
  const [mostrarSenha, setMostrarSenha] = useState(false);

  /**
   * Submete o formulário, repassando os valores digitados para a
   * função externa. O e-mail é tratado com trim para evitar
   * espaços acidentais no começo ou no fim.
   */
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

      <CampoTexto
        rotulo="E-mail"
        type="email"
        placeholder="usuario@empresa.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />

      {/*
        Campo de senha junto com o botão para mostrar e esconder.
        O botão fica posicionado de forma absoluta sobre o campo,
        no canto direito, sem entrar na ordem de tabulação para
        não atrapalhar quem usa o teclado.
      */}
      <div className="relative">
        <CampoTexto
          rotulo="Senha"
          type={mostrarSenha ? "text" : "password"}
          placeholder="********"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
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
        // Só fica disponível quando o usuário digitou algo em e-mail
        // e senha.
        disabled={!email.trim() || !senha.trim()}
      >
        <LogIn className="w-4 h-4" /> Entrar
      </Botao>
    </form>
  );
}
