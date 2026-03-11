/**
 * ============================================================================
 * 📦 COMPONENTE: Configuracoes
 * 💻 PROJETO: SupportBox
 * 👨‍💻 DESENVOLVEDOR: Gabriel
 * ============================================================================
 * 📝 DESCRIÇÃO:
 * Interface de definições do agente. Permite gerir o perfil, visualizar
 * preferências do sistema e efetuar o logout seguro (encerrar a sessão)
 * limpando os dados de autenticação locais.
 * ============================================================================
 */

"use client";

import { Settings, User, Bell, Shield, LogOut } from "lucide-react";

export default function ConfiguracoesPage() {
  const handleLogout = () => {
    localStorage.removeItem("supportbox_agent_auth");
    window.location.href = "/loginagente";
  };

  return (
    <main className="p-6 md:p-10 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="mb-10 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-slate-800 text-white rounded-lg">
            <Settings size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Definições</h1>
        </div>
        <p className="text-slate-500">
          Faça a gestão das preferências de sistema e perfil de acesso.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Menu Lateral das Definições */}
        <div className="md:col-span-4 lg:col-span-3 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 rounded-xl font-medium text-sm transition-colors">
            <User size={18} /> Meu Perfil
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-medium text-sm transition-colors">
            <Bell size={18} /> Notificações
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-medium text-sm transition-colors">
            <Shield size={18} /> Segurança
          </button>
        </div>

        {/* Área de Conteúdo das Definições */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                Informações Pessoais
              </h2>
              <p className="text-sm text-slate-500">
                Atualize a sua foto e detalhes pessoais aqui.
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                  G
                </div>
                <div>
                  <button className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Alterar Avatar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    defaultValue="Gabriel (Agente)"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Cargo
                  </label>
                  <input
                    type="text"
                    defaultValue="Técnico de Suporte Nível 2"
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">
                    E-mail Profissional
                  </label>
                  <input
                    type="email"
                    defaultValue="gabriel.suporte@empresa.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                  Guardar Alterações
                </button>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-2xl border border-red-100 overflow-hidden">
            <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-red-700">
                  Encerrar Sessão
                </h2>
                <p className="text-sm text-red-500 mt-1">
                  Sair do painel de administração com segurança.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
              >
                <LogOut size={18} /> Sair do Sistema
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
