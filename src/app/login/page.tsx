/**
 * ============================================================================
 * COMPONENTE: LoginPage (Tela de Login do Solicitante)
 * PROJETO: SupportBox
 * ============================================================================
 * * DESCRIÇÃO:
 * Esta é a porta de entrada para os usuários comuns (solicitantes) do sistema.
 * Permite a autenticação para acesso ao painel de abertura de chamados.
 * * * ARQUITETURA E ESTADO:
 * - Utiliza "use client" pois gerencia estados de input, loading e modais.
 * - Integração com componentes UI padronizados (Card, Dialog, Input).
 * - NOTA: A autenticação atual utiliza dados "Mock" (simulados) para fins de
 * apresentação. Em produção, a função `handleLogin` deve ser conectada
 * ao backend real.
 * ============================================================================
 * * UI/UX Premium:
 * - Design minimalista com foco na conversão (acesso rápido).
 * - Efeitos de profundidade com sombras orgânicas (shadow-2xl).
 * - Inputs modernos com ícones integrados (Lucide React) e focus rings.
 * - Micro-interações nos botões (hover:scale, transition-all).
 * ============================================================================
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
// Se você estiver usando o botão do shadcn/ui, descomente a linha abaixo e remova o componente Button no final do arquivo.
// import { Button } from "@/components/ui/button";

export default function LoginSolicitantePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulação de Login para a Apresentação
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simula um delay de rede para mostrar o efeito de "Entrando..." no botão
    setTimeout(() => {
      // Salva a sessão e redireciona para o Dashboard do Solicitante
      localStorage.setItem("supportbox_user", "true");
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden p-4">
      {/* --- BACKGROUND ESTRUTURAL --- */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-supportbox/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-supportbox/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* --- CARTÃO DE LOGIN --- */}
      <div className="relative w-full max-w-[420px] bg-white rounded-[2rem] shadow-2xl shadow-supportbox/5 border border-slate-100 p-8 sm:p-10 z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Cabeçalho do Login (Logo e Título) */}
        <div className="flex flex-col items-center text-center mb-10">
          {/* --- LOGO AUMENTADO AQUI --- */}
          {/* Mudamos de w-16/h-16 para w-24/h-24 e adicionamos p-2 */}
          <div className="w-24 h-24 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center mb-6 transform transition-transform hover:scale-105 p-2">
            <img
              src="/IconeLogo.jpg"
              alt="SupportBox Logo"
              // A imagem agora ocupa todo o espaço disponível no container maior
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            SupportBox
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-1 justify-center">
            <ShieldCheck className="w-4 h-4 text-supportbox" />
            Portal Seguro do Colaborador
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Campo de E-mail */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 pl-1">
              E-mail corporativo
            </label>
            <div className="relative group">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-supportbox transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@empresa.com.br"
                className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-supportbox/20 focus:border-supportbox transition-all"
              />
            </div>
          </div>

          {/* Campo de Senha */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between pl-1">
              <label className="text-sm font-semibold text-slate-700">
                Senha
              </label>
              <a
                href="#"
                className="text-xs font-semibold text-supportbox hover:underline hover:text-supportbox-dark transition-colors"
              >
                Esqueceu a senha?
              </a>
            </div>
            <div className="relative group">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-supportbox transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-supportbox/20 focus:border-supportbox transition-all"
              />
            </div>
          </div>

          {/* Lembrar de mim */}
          <div className="flex items-center pt-2 pl-1">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 text-supportbox bg-slate-100 border-slate-300 rounded focus:ring-supportbox cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="ml-2 text-sm text-slate-600 font-medium cursor-pointer select-none"
            >
              Lembrar de mim
            </label>
          </div>

          {/* Botão de Entrar */}
          <Button
            type="submit"
            disabled={isSubmitting || !email || !password}
            className="w-full h-12 rounded-xl bg-supportbox hover:bg-supportbox-dark text-white font-bold text-base shadow-lg shadow-supportbox/25 transition-all hover:-translate-y-0.5 mt-4"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Entrando...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Acessar Portal <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>
        </form>
      </div>

      {/* Footer Minimalista */}
      <div className="mt-8 text-center text-xs font-medium text-slate-400 relative z-10">
        <p>© 2026 SupportBox. Todos os direitos reservados.</p>
        <p className="mt-1 opacity-70">Plataforma de TI Inteligente</p>
      </div>
    </div>
  );
}

// =========================================================================
// COMPONENTE BUTTON LOCAL (Se não estiver usando shadcn/ui)
// =========================================================================
function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
