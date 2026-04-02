/**
 * [V] VIEW: LoginForm
 * ARQUIVO: src/views/auth/LoginForm.tsx
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { loginAction } from "@/controllers/AuthController";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await loginAction(email, password);
      if (result.success) {
        const dest = result.role === "tecnico" ? "/agente" : "/solicitante";
        router.push(dest);
      } else {
        setError(result.error ?? "Credenciais invalidas.");
      }
    } catch {
      setError("Falha na comunicacao com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Entrar no sistema</h2>
        <p className="text-slate-400 text-sm mt-1">Use as credenciais fornecidas pela TI</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">E-mail corporativo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@empresa.com"
            required
            disabled={isLoading}
            className="w-full h-12 px-4 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 transition-all disabled:opacity-50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">Senha</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              disabled={isLoading}
              className="w-full h-12 px-4 pr-12 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !email.trim() || !password.trim()}
          className="w-full h-12 mt-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Autenticando...</>
          ) : (
            <><LogIn className="w-4 h-4" /> Acessar</>
          )}
        </button>
      </form>
    </div>
  );
}
