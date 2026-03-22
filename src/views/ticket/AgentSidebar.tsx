/**
 * ============================================================================
 * 📦 COMPONENTE: AgentSidebar (Barra Lateral Inteligente do Agente)
 * 💻 PROJETO: SupportBox
 * 👨‍💻 DESENVOLVEDOR: Gabriel
 * ============================================================================
 * 📝 DESCRIÇÃO:
 * Este componente renderiza a barra lateral (Sidebar) de navegação exclusiva
 * para o painel da equipe de TI.
 * * * 🧠 INTELIGÊNCIA:
 * Ele é considerado um "Componente Inteligente" pois utiliza o hook `usePathname`
 * nativo do Next.js. Com isso, ele "lê" a URL atual do navegador e detecta
 * automaticamente em qual página o técnico está, destacando (pintando de laranja)
 * o botão correspondente no menu para fornecer feedback visual instantâneo.
 * ============================================================================
 */

"use client"; // Necessário pois usamos hooks (usePathname) que interagem com o navegador do cliente

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  Users,
  Settings,
  Headphones,
} from "lucide-react";

export function AgentSidebar() {
  // =========================================================================
  // 1. ESTADOS E HOOKS DE ROTEAMENTO
  // =========================================================================
  // Pega a URL exata atual (ex: "/agente/meus-chamados") para sabermos qual botão acender
  const pathname = usePathname();

  // =========================================================================
  // 2. CONFIGURAÇÃO DO MENU (ESTRUTURA DE DADOS)
  // =========================================================================
  // Matriz de objetos que define os botões da barra lateral.
  // Para adicionar uma nova página no futuro, basta adicionar um novo bloco aqui!
  const menuItems = [
    {
      name: "Painel de Controle",
      href: "/agente", // Rota principal do agente ajustada para combinar com a pasta "agente"
      icon: LayoutDashboard,
    },
    {
      name: "Meus Chamados",
      href: "/agente/meus-chamados",
      icon: Ticket,
    },
    {
      name: "Solicitantes",
      href: "/agente/solicitantes",
      icon: Users,
    },
    {
      name: "Configurações",
      href: "/agente/configuracoes",
      icon: Settings,
    },
  ];

  // =========================================================================
  // 3. RENDERIZAÇÃO DA INTERFACE (JSX)
  // =========================================================================
  return (
    <aside className="w-64 min-h-screen bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-800">
      {/* --- LOGOTIPO SUPPORTBOX --- */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
        <div className="bg-orange-500/20 p-2 rounded-xl text-orange-500">
          <Headphones className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">
            SupportBox
          </h1>
          <p className="text-orange-500 text-xs font-medium">Workspace de TI</p>
        </div>
      </div>

      {/* --- MENU DE NAVEGAÇÃO DINÂMICO --- */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Lógica central: Se a URL do navegador bater exatamente com o href do botão, ele está ativo.
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              // O Tailwind utiliza Template Literals (``) para aplicar classes condicionalmente
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? "bg-slate-800 text-orange-400 shadow-sm" // ESTILO: Botão Selecionado
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200" // ESTILO: Botão Inativo
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-orange-400" : "text-slate-400"}`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* --- RODAPÉ DA BARRA LATERAL (PERFIL DO AGENTE) --- */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
          {/* Avatar (Incial do nome) */}
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
            G
          </div>
          {/* Informações do Usuário */}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">Gabriel (Você)</span>
            <span className="text-xs text-slate-400">Técnico Nível 2</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
