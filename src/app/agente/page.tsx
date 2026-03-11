/**
 * ============================================================================
 * 📦 COMPONENTE: AgenteDashboard (Painel de Controle da TI)
 * 💻 PROJETO: SupportBox
 * ============================================================================
 * 📝 DESCRIÇÃO:
 * Tela principal (Visão Geral) com painéis analíticos sobre a esteira de
 * chamados, indicadores de prioridade, taxa de resolução e a fila completa.
 * ============================================================================
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, Ticket } from "@/lib/db";
import { TicketAgentModal } from "@/components/ticket-agent-modal";
import {
  AlertCircle,
  Clock,
  PlayCircle,
  Search,
  Filter,
  TicketIcon,
  CheckCircle2,
  TrendingUp,
  BarChart3,
} from "lucide-react";

export default function AgenteDashboard() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const fetchTickets = async () => {
    const data = await db.getTickets();
    setTickets(data);
  };

  useEffect(() => {
    const isAuth = localStorage.getItem("supportbox_agent_auth");
    if (!isAuth) {
      router.push("/loginagente");
      return;
    }

    fetchTickets();

    const interval = setInterval(() => {
      fetchTickets();
    }, 3000);

    return () => clearInterval(interval);
  }, [router]);

  // =========================================================================
  // CÁLCULO DE ESTATÍSTICAS E MÉTRICAS
  // =========================================================================
  const totalTickets = tickets.length;
  const aguardando = tickets.filter(
    (t) => t.status === "Aguardando Atendimento" || t.status === "Pendente",
  ).length;
  const emAndamento = tickets.filter((t) => t.status === "Em Andamento").length;
  const concluidos = tickets.filter(
    (t) => t.status === "Concluído" || t.status === "Resolvido",
  ).length;

  const urgentes = tickets.filter(
    (t) => t.priority === "Urgente" || t.priority === "Crítica",
  ).length;
  const altas = tickets.filter((t) => t.priority === "Alta").length;
  const medias = tickets.filter((t) => t.priority === "Média").length;
  const baixas = tickets.filter((t) => t.priority === "Baixa").length;

  // Cálculo de Porcentagens para as Barras de Progresso
  const calcPercent = (value: number) =>
    totalTickets === 0 ? 0 : Math.round((value / totalTickets) * 100);
  const taxaResolucao = calcPercent(concluidos);

  return (
    <main className="p-6 md:p-10 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Visão Geral
        </h1>
        <p className="text-slate-500 mt-1">
          Acompanhe os indicadores de desempenho e a fila atual do setor de TI.
        </p>
      </header>

      {/* =========================================================================
          LINHA 1: CARDS DE MÉTRICAS RÁPIDAS (KPIs)
          ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
            <TicketIcon size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total na Base</p>
            <p className="text-3xl font-bold text-slate-800">{totalTickets}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-yellow-100 text-yellow-600 rounded-xl">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Aguardando</p>
            <p className="text-3xl font-bold text-slate-800">{aguardando}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-xl">
            <PlayCircle size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Em Andamento</p>
            <p className="text-3xl font-bold text-slate-800">{emAndamento}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex items-center gap-4 relative overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-4 bg-red-100 text-red-600 rounded-xl">
            <AlertCircle size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Urgentes</p>
            <p className="text-3xl font-bold text-slate-800">{urgentes}</p>
          </div>
          <div className="absolute top-0 right-0 w-1.5 h-full bg-red-500"></div>
        </div>
      </section>

      {/* =========================================================================
          LINHA 2: PAINÉIS ANALÍTICOS (GRÁFICOS / BARRAS)
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Painel de Taxa de Resolução */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="text-green-500 w-5 h-5" /> Taxa de
                Resolução
              </h2>
              <p className="text-sm text-slate-500">
                Percentual de chamados concluídos em relação ao total.
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-slate-800">
                {taxaResolucao}%
              </span>
            </div>
          </div>

          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${taxaResolucao}%` }}
            >
              {/* Efeito de brilho na barra */}
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
            </div>
          </div>

          <div className="flex justify-between text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> {concluidos}{" "}
              Concluídos
            </span>
            <span>{totalTickets - concluidos} Pendentes/Em Andamento</span>
          </div>
        </div>

        {/* Painel de Prioridades */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <BarChart3 className="text-blue-500 w-5 h-5" /> Fila por Prioridade
          </h2>

          <div className="space-y-4">
            {/* Item Urgente */}
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium">
                <span className="text-red-600">Urgente</span>
                <span className="text-slate-600">
                  {urgentes} ({calcPercent(urgentes)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${calcPercent(urgentes)}%` }}
                ></div>
              </div>
            </div>

            {/* Item Alta */}
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium">
                <span className="text-orange-500">Alta</span>
                <span className="text-slate-600">
                  {altas} ({calcPercent(altas)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${calcPercent(altas)}%` }}
                ></div>
              </div>
            </div>

            {/* Item Média */}
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium">
                <span className="text-blue-500">Média</span>
                <span className="text-slate-600">
                  {medias} ({calcPercent(medias)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${calcPercent(medias)}%` }}
                ></div>
              </div>
            </div>

            {/* Item Baixa */}
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium">
                <span className="text-slate-500">Baixa</span>
                <span className="text-slate-600">
                  {baixas} ({calcPercent(baixas)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-400 rounded-full"
                  style={{ width: `${calcPercent(baixas)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LINHA 3: TABELA DE FILA DE ATENDIMENTO
          ========================================================================= */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-8">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">
            Esteira de Chamados
          </h2>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Pesquisar por ID, título..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                <th className="py-4 px-6 font-semibold">Título do Problema</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Prioridade</th>
                <th className="py-4 px-6 font-semibold">Data</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="w-10 h-10 mb-3 text-slate-300" />
                      Nenhum chamado registrado na base de dados.
                    </div>
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
                        ${ticket.status === "Aguardando Atendimento" || ticket.status === "Pendente" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                        ${ticket.status === "Em Andamento" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
                        ${ticket.status === "Concluído" || ticket.status === "Resolvido" ? "bg-green-50 text-green-700 border-green-200" : ""}
                      `}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`flex items-center gap-1.5 text-xs font-semibold
                        ${ticket.priority === "Urgente" || ticket.priority === "Crítica" ? "text-red-600" : ""}
                        ${ticket.priority === "Alta" ? "text-orange-500" : ""}
                        ${ticket.priority === "Média" ? "text-blue-500" : ""}
                        ${ticket.priority === "Baixa" ? "text-slate-500" : ""}
                      `}
                      >
                        <div
                          className={`w-2 h-2 rounded-full 
                          ${ticket.priority === "Urgente" || ticket.priority === "Crítica" ? "bg-red-600 animate-pulse" : ""}
                          ${ticket.priority === "Alta" ? "bg-orange-500" : ""}
                          ${ticket.priority === "Média" ? "bg-blue-500" : ""}
                          ${ticket.priority === "Baixa" ? "bg-slate-400" : ""}
                        `}
                        ></div>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {ticket.date ||
                        new Date(ticket.created_at!).toLocaleDateString(
                          "pt-BR",
                        )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- MODAL FLUTUANTE SUBSTITUÍDO PELO COMPONENTE IMPORTADO --- */}
      <TicketAgentModal
        ticketId={selectedTicket?.id || null}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onTicketUpdated={fetchTickets}
      />
    </main>
  );
}
