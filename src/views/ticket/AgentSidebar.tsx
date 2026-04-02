/**
 * [V] VIEW: AgentSidebar
 * ARQUIVO: src/views/ticket/AgentSidebar.tsx
 */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, Headphones, LogOut } from "lucide-react";
import { logoutAction, getCurrentUserAction } from "@/controllers/AuthController";

export function AgentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userName, setUserName] = useState("Tecnico");

  useEffect(() => {
    getCurrentUserAction().then((user) => {
      if (user) setUserName(user.name);
    });
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAction();
    router.push("/login");
  };

  const isActive = pathname === "/agente";

  return (
    <aside className="w-64 min-h-screen bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-800">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
        <div className="bg-orange-500/20 p-2 rounded-xl text-orange-500">
          <Headphones className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">SupportBox</h1>
          <p className="text-orange-500 text-xs font-medium">Workspace de TI</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6">
        <Link
          href="/agente"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
            isActive
              ? "bg-slate-800 text-orange-400 shadow-sm"
              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${isActive ? "text-orange-400" : "text-slate-400"}`} />
          Painel de Controle
        </Link>
      </nav>

      {/* Rodape */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white truncate">{userName}</span>
            <span className="text-xs text-slate-400">Tecnico de TI</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium disabled:opacity-50"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {isLoggingOut ? "Saindo..." : "Sair do sistema"}
        </button>
      </div>
    </aside>
  );
}
