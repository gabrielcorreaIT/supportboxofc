/**
 * [V] VIEW: TicketList (Lista de chamados do Agente)
 * ARQUIVO: src/views/ticket/ticket-list.tsx
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { getDashboardDataAction } from "@/controllers/TicketController";
import { TicketAgentModal } from "@/views/ticket/ticket-agent-modal";
import type { Ticket } from "@/models/types";
import { getStatusColor, getPriorityColor, formatDate } from "@/lib/ticket-utils";
import { Clock, Package, Search, AlertTriangle, Loader2, RefreshCw } from "lucide-react";

type StatusFilter = "all" | "open" | "in-progress" | "done";

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getDashboardDataAction();
      if (result.success && result.data) setTickets(result.data.tickets);
    } catch (error) {
      console.error("Erro ao carregar chamados:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const filteredTickets = tickets.filter((ticket) => {
    const texto = `${ticket.title} ${ticket.ticket_number} ${ticket.requester}`.toLowerCase();
    const matchesSearch = texto.includes(searchQuery.toLowerCase());

    let matchesStatus = statusFilter === "all";
    if (statusFilter === "open" && ticket.status === "Aberto") matchesStatus = true;
    if (statusFilter === "in-progress" && ticket.status === "Em Andamento") matchesStatus = true;
    if (statusFilter === "done" && ticket.status === "Concluído") matchesStatus = true;

    return matchesSearch && matchesStatus;
  });

  const statusTabs: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "Todos" },
    { value: "open", label: "Abertos" },
    { value: "in-progress", label: "Em Andamento" },
    { value: "done", label: "Concluidos" },
  ];

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Pesquisar chamados..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[300px] pl-9 pr-4 h-10 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
            {statusTabs.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === value
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={fetchTickets}
            disabled={isLoading}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-orange-500 hover:border-orange-300 transition-colors disabled:opacity-50"
            title="Recarregar"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Conteudo */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-3" />
          <p className="text-slate-500 font-medium text-sm">Carregando chamados...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
          <Package className="h-10 w-10 text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">Nenhum chamado encontrado.</p>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="mt-2 text-sm text-orange-500 hover:underline">
              Limpar busca
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3 items-start min-w-0">
                  {ticket.type === "incident"
                    ? <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    : <Package className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  }
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{ticket.title}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      <span className="font-mono font-medium text-slate-700">{ticket.ticket_number}</span>
                      {" \u2022 "}{ticket.requester}{" \u2022 "}{ticket.category}
                      {ticket.assigned_to && <span className="text-orange-500"> \u2022 {ticket.assigned_to}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <span className={`${getPriorityColor(ticket.priority)} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
                    {ticket.priority}
                  </span>
                  <span className={`${getStatusColor(ticket.status)} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center text-xs text-slate-400 gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(ticket.created_at)}
                </div>
                <button
                  onClick={() => { setSelectedProtocol(ticket.ticket_number); setIsModalOpen(true); }}
                  className="text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline transition-colors"
                >
                  Ver detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TicketAgentModal
        ticketProtocol={selectedProtocol}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedProtocol(null); }}
        onTicketUpdated={fetchTickets}
      />
    </div>
  );
}
