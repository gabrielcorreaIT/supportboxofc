/**
 * CAMADA: View — Formulario de Login
 * ARQUIVO: src/views/auth/LoginForm.tsx
 *
 * DESCRICAO:
 *   Formulario onde o usuario digita e-mail e senha para entrar no sistema.
 *   Apos o login bem-sucedido, redireciona automaticamente:
 *     - Tecnicos    -> /agente     (painel de gerenciamento)
 *     - Solicitantes -> /solicitante (portal de chamados)
 *
 * CONEXOES:
 *   - Depende de: AuthController.acaoLogin (autentica no servidor)
 *   - Usado por:  src/app/(auth)/login/page.tsx (pagina de login)
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { acaoLogin } from "@/controllers/AuthController";

export function FormularioLogin() {
  const router = useRouter();

  // Estado do formulario
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  /** Envia credenciais ao Controller e redireciona conforme o papel. */
  const enviarFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const resultado = await acaoLogin(email, senha);

      if (resultado.sucesso) {
        const destino = resultado.papel === "tecnico" ? "/agente" : "/solicitante";
        router.push(destino);
      } else {
        setErro(resultado.erro ?? "Credenciais invalidas.");
      }
    } catch {
      setErro("Falha na comunicacao com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
      {/* Cabecalho */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Entrar no sistema</h2>
        <p className="text-slate-400 text-sm mt-1">Use as credenciais fornecidas pela TI</p>
      </div>

      {/* Mensagem de erro (aparece quando o login falha) */}
      {erro && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
          {erro}
        </div>
      )}

      <form onSubmit={enviarFormulario} className="space-y-4">
        {/* Campo de e-mail */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">E-mail corporativo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@empresa.com"
            required
            disabled={carregando}
            className="w-full h-12 px-4 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 transition-all disabled:opacity-50"
          />
        </div>

        {/* Campo de senha (com botao para mostrar/esconder) */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">Senha</label>
          <div className="relative">
            <input
              type={mostrarSenha ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="********"
              required
              disabled={carregando}
              className="w-full h-12 px-4 pr-12 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              tabIndex={-1}
            >
              {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Botao de envio */}
        <button
          type="submit"
          disabled={carregando || !email.trim() || !senha.trim()}
          className="w-full h-12 mt-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {carregando ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Autenticando...</>
          ) : (
            <><LogIn className="w-4 h-4" /> Acessar</>
          )}
        </button>
      </form>
    </div>
  );
}
