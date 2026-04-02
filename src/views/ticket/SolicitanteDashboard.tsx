/**
 * [V] VIEW: SolicitanteDashboard
 * ARQUIVO: src/views/ticket/SolicitanteDashboard.tsx
 *
 * Tela principal do solicitante: header, formulario de abertura,
 * lista dos seus chamados e chatbot flutuante.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Headphones, LogOut, RefreshCw, Clock, Loader2, Package, AlertTriangle } from "lucide-react";
import { getCurrentUserAction, logoutAction } from "@/controllers/AuthController";
import { getMyTicketsAction } from "@/controllers/TicketController";
import { TicketForm } from "@/views/ticket/TicketForm";
import { TicketAgentModal } from "@/views/ticket/ticket-agent-modal";
import { AIAgent } from "@/views/ticket/AIAgent";
import { getStatusColor, formatDate } from "@/lib/ticket-utils";
import type { Ticket } from "@/models/types";

export function SolicitanteDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchUser = useCallback(async () => {
    const user = await getCurrentUserAction();
    if (!user) {
      router.push("/login");
      return;
    }
    setUserName(user.name);
    return user.name;
  }, [router]);

  const fetchTickets = useCallback(async (name?: string) => {
    const requester = name || userName;
    if (!requester) return;
    setIsLoading(true);
    try {
      const result = await getMyTicketsAction(requester);
      if (result.success && result.tickets) setTickets(result.tickets);
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userName]);

  useEffect(() => {
    fetchUser().then((name) => {
      if (name) fetchTickets(name);
    });
  }, [fetchUser, fetchTickets]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAction();
    router.push("/login");
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 p-2 rounded-xl text-orange-500">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">SupportBox</h1>
              <p className="text-xs text-slate-400">Portal do Solicitante</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-300 hidden sm:block">
              {userName}
            </span>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{isLoggingOut ? "Saindo..." : "Sair"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteudo */}
      <main className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Formulario de abertura */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Abrir Chamado</h2>
          <TicketForm requesterName={userName} />
        </section>

        {/* Lista de chamados */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Meus Chamados</h2>
            <button
              onClick={() => fetchTickets()}
              disabled={isLoading}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-orange-500 hover:border-orange-300 transition-colors disabled:opacity-50"
              title="Recarregar"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-3" />
              <p className="text-slate-500 text-sm">Carregando seus chamados...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <Package className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500">Voce ainda nao possui chamados.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => { setSelectedProtocol(ticket.ticket_number); setIsModalOpen(true); }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3 items-start min-w-0">
                      {ticket.type === "incident"
                        ? <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        : <Package className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      }
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{ticket.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          <span className="font-mono font-medium text-slate-600 dark:text-slate-400">{ticket.ticket_number}</span>
                          {" \u2022 "}{ticket.category}
                        </p>
                      </div>
                    </div>
                    <span className={`${getStatusColor(ticket.status)} text-white text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-slate-400 gap-1.5 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(ticket.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal de detalhes (somente leitura + comentarios) */}
      <TicketAgentModal
        ticketProtocol={selectedProtocol}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedProtocol(null); }}
        onTicketUpdated={() => fetchTickets()}
        userName={userName}
        readOnly
      />

      {/* Chatbot flutuante */}
      <AIAgent />
    </>
  );
}
