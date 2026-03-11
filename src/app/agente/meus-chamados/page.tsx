/**
 * ============================================================================
 * 📦 COMPONENTE: MeusChamados
 * 💻 PROJETO: SupportBox
 * 👨‍💻 DESENVOLVEDOR: Gabriel
 * ============================================================================
 * 📝 DESCRIÇÃO:
 * Página responsável por listar os chamados atribuídos ao agente logado.
 * Permite visualizar detalhes, filtrar e aceder ao modal de resposta
 * (TicketAgentModal) diretamente a partir desta interface.
 * ============================================================================
 */

"use client";

import { useState, useEffect } from "react";
import { db, Ticket } from "@/lib/db";
import { TicketAgentModal } from "@/components/ticket-agent-modal";
import {
  Ticket as TicketIcon,
  Search,
  Filter,
  AlertCircle,
} from "lucide-react";

export default function MeusChamadosPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const fetchTickets = async () => {
    // Aqui no futuro podes filtrar apenas os chamados "atribuídos a mim"
    // Por enquanto, vamos trazer todos para a tela não ficar vazia
    const data = await db.getTickets();
    setTickets(data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <main className="p-6 md:p-10 animate-in fade-in duration-500">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
            <TicketIcon size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Meus Chamados</h1>
        </div>
        <p className="text-slate-500">
          Faça a gestão dos tickets que estão sob sua responsabilidade.
        </p>
      </header>

      <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Procurar nos meus chamados..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter size={16} /> Filtrar
            </button>
          </div>
        </div>

        <div className="p-6 grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {tickets.length === 0 ? (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
              <AlertCircle size={48} className="mb-4 opacity-20" />
              <p>Não tem chamados atribuídos no momento.</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="p-5 bg-white border border-slate-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-slate-400 group-hover:text-orange-500 transition-colors">
                    {ticket.id}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                    ${ticket.status === "Aguardando Atendimento" ? "bg-yellow-100 text-yellow-700" : ""}
                    ${ticket.status === "Em Andamento" ? "bg-orange-100 text-orange-700" : ""}
                    ${ticket.status === "Concluído" ? "bg-green-100 text-green-700" : ""}
                  `}
                  >
                    {ticket.status}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 line-clamp-1">
                  {ticket.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                  {ticket.description}
                </p>
                <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-100 pt-3">
                  <span className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      {ticket.requester.charAt(0)}
                    </div>
                    {ticket.requester}
                  </span>
                  <span>
                    {ticket.date ||
                      new Date(ticket.created_at!).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Modal para abrir o chamado ao clicar no card */}
      <TicketAgentModal
        ticketId={selectedTicket?.id || null}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onTicketUpdated={fetchTickets}
      />
    </main>
  );
}
