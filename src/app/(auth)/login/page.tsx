import Link from "next/link";
import { Headphones } from "lucide-react";

export const metadata = {
  title: "Login do Agente | SupportBox",
  description: "Acesse o painel exclusivo para técnicos e agentes de TI.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Cabeçalho do Login */}
        <div className="bg-[#0f172a] p-8 text-center flex flex-col items-center">
          <div className="bg-orange-500/20 p-3 rounded-2xl text-orange-500 mb-4">
            <Headphones className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">SupportBox</h1>
          <p className="text-slate-400 text-sm">Portal Exclusivo para TI</p>
        </div>

        {/* Formulário (Estático para simulação Front-end) */}
        <div className="p-8">
          <form className="space-y-5" action="/agente">
            <div className="space-y-1">
              <label 
                htmlFor="email" 
                className="text-sm font-semibold text-slate-700 block"
              >
                E-mail Corporativo
              </label>
              <input
                id="email"
                type="email"
                placeholder="agente@empresa.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            <div className="space-y-1">
              <label 
                htmlFor="password" 
                className="text-sm font-semibold text-slate-700 block"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors mt-2"
            >
              Entrar no Painel
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="text-xs text-slate-500 hover:text-orange-500 transition-colors font-medium"
            >
              ← Voltar para a Abertura de Chamados (Usuário)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
