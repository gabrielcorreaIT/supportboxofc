/**
 * [V] PAGE: Login
 * ARQUIVO: src/app/(auth)/login/page.tsx
 */
import { LoginForm } from "@/views/auth/LoginForm";
import { Headphones } from "lucide-react";

export const metadata = {
  title: "Login | SupportBox",
  description: "Acesso ao sistema SupportBox",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-orange-500/20 p-4 rounded-2xl text-orange-500 mb-4 shadow-lg shadow-orange-500/10">
            <Headphones className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">SupportBox</h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">Help Desk Corporativo — Acesso Restrito</p>
        </div>

        <LoginForm />

        <p className="text-center text-xs text-slate-600 mt-6">
          Problemas para acessar?{" "}
          <a href="mailto:ti@empresa.com" className="text-orange-500/70 hover:text-orange-400 transition-colors">
            Contate o administrador
          </a>
        </p>
      </div>
    </main>
  );
}
