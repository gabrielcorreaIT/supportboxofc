/**
 * ============================================================================
 * COMPONENTE: AgenteDashboard (Painel do Setor de TI)
 * PROJETO: SupportBox
 * ============================================================================
 * * DESCRIÇÃO:
 * Tela principal de uso exclusivo dos técnicos de TI (Agentes).
 * Exibe a fila de chamados em tempo real, conectada ao Supabase.
 * * * ARQUITETURA DE DADOS (Supabase Integration):
 * - Polling Inteligente: Utiliza um `setInterval` dentro do `useEffect` para
 * buscar novos chamados na nuvem a cada 3 segundos, criando um efeito de
 * "Tempo Real" sem a necessidade de WebSockets complexos.
 * - Atualização Otimista: Ao resolver um chamado, a interface é atualizada
 * imediatamente no estado local, enquanto o Supabase processa no background.
 * ============================================================================
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, Ticket } from "@/lib/db"; // Importando nosso motor do banco de dados e a tipagem
import {
  AlertCircle,
  Clock,
  PlayCircle,
  Search,
  Filter,
  TicketIcon,
  User,
  LogOut,
  X,
  CheckCircle,
  LayoutDashboard,
  Settings,
  Users,
  HeadphonesIcon,
} from "lucide-react";

export default function AgenteDashboard() {
  // =========================================================================
  // 1. ESTADOS DO COMPONENTE
  // =========================================================================
  const router = useRouter();

  // A lista de chamados agora começa vazia e será preenchida pela nuvem
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Controla qual chamado foi clicado para abrir no Modal
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // =========================================================================
  // 2. LÓGICA DE SEGURANÇA E CONEXÃO COM A NUVEM (SUPABASE)
  // =========================================================================
  useEffect(() => {
    // Verifica se a chave de autenticação existe no navegador do usuário
    const isAuth = localStorage.getItem("supportbox_agent_auth");
    if (!isAuth) {
      router.push("/loginagente");
      return;
    }

    // Função interna que busca os dados no Supabase
    const fetchTickets = async () => {
      const data = await db.getTickets();
      setTickets(data);
    };

    // 1ª Chamada: Carrega os tickets assim que a tela abre
    fetchTickets();

    // RADAR (Polling): A cada 3 segundos, busca tickets novos silenciosamente
    const interval = setInterval(() => {
      fetchTickets();
    }, 3000);

    // Limpeza: desliga o radar se o agente fechar a tela
    return () => clearInterval(interval);
  }, [router]);

  // =========================================================================
  // 3. FUNÇÕES DE AÇÃO (HANDLERS)
  // =========================================================================

  const handleLogout = () => {
    localStorage.removeItem("supportbox_agent_auth");
    router.push("/loginagente");
  };

  /**
   * ATUALIZADO: Altera o status do chamado no Supabase para "Concluído"
   */
  const handleResolveTicket = async () => {
    if (!selectedTicket) return;

    // 1. Manda a ordem para a nuvem (Supabase) atualizar o banco real
    await db.updateTicketStatus(selectedTicket.id, "Concluído");

    // 2. Atualiza a tela do agente imediatamente (Atualização Otimista)
    const updatedTickets = tickets.map((t) =>
      t.id === selectedTicket.id ? { ...t, status: "Concluído" } : t,
    );

    setTickets(updatedTickets);
    setSelectedTicket(null); // Fecha o Modal
  };

  // =========================================================================
  // 4. RENDERIZAÇÃO DA INTERFACE (JSX + Tailwind)
  // =========================================================================
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 relative">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* --- BARRA LATERAL (SIDEBAR) --- */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col relative z-10 shadow-2xl">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-supportbox p-2 rounded-xl">
              <HeadphonesIcon size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">SupportBox</h2>
              <span className="text-xs text-supportbox font-medium">
                Workspace de TI
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-supportbox/10 text-supportbox rounded-xl font-medium transition-colors">
            <LayoutDashboard size={20} /> Painel de Controle
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
            <TicketIcon size={20} /> Meus Chamados
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
            <Users size={20} /> Solicitantes
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
            <Settings size={20} /> Configurações
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold">
                TI
              </div>
              <div>
                <p className="text-sm font-medium text-white">Agente Local</p>
                <p className="text-xs text-slate-400">Nível 2</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
              title="Sair do sistema"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* --- ÁREA DE CONTEÚDO PRINCIPAL (DASHBOARD) --- */}
      <main className="flex-1 overflow-y-auto relative z-10 p-6 md:p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">Visão Geral</h1>
          <p className="text-slate-500 mt-1">
            Acompanhe e gerencie a fila de chamados do setor de TI.
          </p>
        </header>

        {/* MÉTRICAS */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
              <TicketIcon size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total</p>
              <p className="text-3xl font-bold text-slate-800">
                {tickets.length}
              </p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-4 bg-yellow-100 text-yellow-600 rounded-xl">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Aguardando</p>
              <p className="text-3xl font-bold text-slate-800">
                {
                  tickets.filter((t) => t.status === "Aguardando Atendimento")
                    .length
                }
              </p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-4 bg-supportbox/10 text-supportbox rounded-xl">
              <PlayCircle size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Em Andamento</p>
              <p className="text-3xl font-bold text-slate-800">
                {tickets.filter((t) => t.status === "Em Andamento").length}
              </p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center gap-4 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 bg-red-100 text-red-600 rounded-xl">
              <AlertCircle size={28} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Urgentes</p>
              <p className="text-3xl font-bold text-slate-800">
                {tickets.filter((t) => t.priority === "Urgente").length}
              </p>
            </div>
            <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
          </div>
        </section>

        {/* TABELA DE FILA DE ATENDIMENTO */}
        <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">
              Fila de Atendimento
            </h2>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Buscar chamado..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-supportbox/50"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Filter size={16} /> Filtrar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-sm border-b border-slate-100">
                  <th className="py-4 px-6 font-semibold">ID</th>
                  <th className="py-4 px-6 font-semibold">Solicitante</th>
                  <th className="py-4 px-6 font-semibold">
                    Título do Problema
                  </th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Prioridade</th>
                  <th className="py-4 px-6 font-semibold">Data</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      Nenhum chamado na fila no momento.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="border-b border-slate-50 hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-slate-900">
                        {ticket.id}
                      </td>
                      <td className="py-4 px-6 text-slate-600 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                          {ticket.requester.charAt(0)}
                        </div>
                        {ticket.requester}
                      </td>
                      <td className="py-4 px-6 text-slate-800 font-medium">
                        {ticket.title}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border
                          ${ticket.status === "Aguardando Atendimento" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                          ${ticket.status === "Em Andamento" ? "bg-supportbox/10 text-supportbox border-supportbox/20" : ""}
                          ${ticket.status === "Concluído" ? "bg-green-50 text-green-700 border-green-200" : ""}
                        `}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`flex items-center gap-1.5 text-xs font-semibold
                          ${ticket.priority === "Urgente" ? "text-red-600" : ""}
                          ${ticket.priority === "Alta" ? "text-orange-500" : ""}
                          ${ticket.priority === "Média" ? "text-blue-500" : ""}
                          ${ticket.priority === "Baixa" ? "text-slate-500" : ""}
                        `}
                        >
                          <div
                            className={`w-2 h-2 rounded-full 
                            ${ticket.priority === "Urgente" ? "bg-red-600 animate-pulse" : ""}
                            ${ticket.priority === "Alta" ? "bg-orange-500" : ""}
                            ${ticket.priority === "Média" ? "bg-blue-500" : ""}
                            ${ticket.priority === "Baixa" ? "bg-slate-400" : ""}
                          `}
                          ></div>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {ticket.date}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* --- MODAL FLUTUANTE --- */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <span className="text-supportbox font-bold text-sm bg-supportbox/10 px-2 py-1 rounded-md">
                    {selectedTicket.id}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-800 mt-2">
                    {selectedTicket.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">
                      Solicitante
                    </p>
                    <p className="font-medium text-slate-900 flex items-center gap-2">
                      <User size={16} className="text-slate-400" />{" "}
                      {selectedTicket.requester}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">
                      Data de Abertura
                    </p>
                    <p className="font-medium text-slate-900 flex items-center gap-2">
                      <Clock size={16} className="text-slate-400" />{" "}
                      {selectedTicket.date}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800 mb-2">
                    Descrição do Problema
                  </p>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 text-slate-700 text-sm leading-relaxed shadow-inner">
                    {selectedTicket.description}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Fechar
                </button>

                {selectedTicket.status !== "Concluído" && (
                  <button
                    onClick={handleResolveTicket}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <CheckCircle size={18} /> Resolver Chamado
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
