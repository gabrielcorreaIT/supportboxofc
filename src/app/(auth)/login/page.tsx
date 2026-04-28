/**
 * CAMADA: View (Page) — Pagina de Login
 * ARQUIVO: src/app/(auth)/login/page.tsx
 *
 * DESCRICAO:
 *   Pagina publica de autenticacao. Exibe o logo do SupportBox e
 *   o formulario de login (LoginForm). Nao requer autenticacao.
 *
 * CONEXOES:
 *   - Depende de: FormularioLogin (componente do formulario)
 *   - Acessada por: usuarios nao autenticados
 */
import { FormularioLogin } from "@/views/auth/LoginForm";
import { PackageCheck } from "lucide-react";

export const metadata = {
  title: "Login | SupportBox",
  description: "Acesso ao sistema SupportBox",
};

export default function PaginaLogin() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Circulo decorativo superior-esquerdo */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* Circulo decorativo inferior-direito */}
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo e titulo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-orange-500/15 p-4 rounded-2xl text-orange-500 mb-4">
            <PackageCheck className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            SupportBox
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            Help Desk Inteligente
          </p>
        </div>

        {/* Formulario de login */}
        <FormularioLogin />

        <p className="text-center text-xs text-slate-500 mt-6">
          Problemas para acessar?{" "}
          <a
            href="mailto:ti@empresa.com"
            className="text-orange-500/70 hover:text-orange-400 transition-colors"
          >
            Contate o administrador
          </a>
        </p>
      </div>
    </main>
  );
}
