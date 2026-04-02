/**
 * [V] VIEW: TicketAgentModal (Detalhes do chamado)
 * ARQUIVO: src/views/ticket/ticket-agent-modal.tsx
 */
"use client";

import { useState, useEffect } from "react";
import { Clock, MessageSquare, User, Send, CheckCircle, Loader2, X, Tag, UserCheck } from "lucide-react";
import {
  getTicketDetailsAction,
  addTicketCommentAction,
  updateTicketStatusAction,
  assignTicketAction,
} from "@/controllers/TicketController";
import type { Ticket, Comment } from "@/models/types";
import { getStatusColor, getPriorityBadge, formatDate } from "@/lib/ticket-utils";

interface TicketAgentModalProps {
  ticketProtocol: string | null;
  isOpen: boolean;
  onClose: () => void;
  onTicketUpdated?: () => void;
  /** Nome do usuario logado (para comentarios) */
  userName?: string;
  /** Se true, esconde botoes de acao do agente (assumir, concluir) */
  readOnly?: boolean;
}

type TicketWithInteractions = Ticket & { interactions: Comment[] };

export function TicketAgentModal({
  ticketProtocol,
  isOpen,
  onClose,
  onTicketUpdated,
  userName = "Equipe de TI",
  readOnly = false,
}: TicketAgentModalProps) {
  const [ticket, setTicket] = useState<TicketWithInteractions | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (!ticketProtocol || !isOpen) return;
    setIsLoading(true);
    setTicket(null);
    getTicketDetailsAction(ticketProtocol).then((result) => {
      if (result.success && result.data) setTicket(result.data as TicketWithInteractions);
      setIsLoading(false);
    });
  }, [ticketProtocol, isOpen]);

  const refresh = async () => {
    if (!ticketProtocol) return;
    const result = await getTicketDetailsAction(ticketProtocol);
    if (result.success && result.data) setTicket(result.data as TicketWithInteractions);
    onTicketUpdated?.();
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !ticket) return;
    setIsSending(true);
    const result = await addTicketCommentAction(ticket.id, userName, newComment);
    if (result.success) { setNewComment(""); await refresh(); }
    setIsSending(false);
  };

  const handleAssign = async () => {
    if (!ticket) return;
    setIsAssigning(true);
    await assignTicketAction(ticket.id, userName);
    await addTicketCommentAction(ticket.id, "Sistema", `Chamado assumido por ${userName}.`);
    await refresh();
    setIsAssigning(false);
  };

  const handleResolve = async () => {
    if (!ticket) return;
    setIsResolving(true);
    await updateTicketStatusAction(ticket.id, "Concluído");
    await addTicketCommentAction(ticket.id, "Sistema", `Chamado encerrado por ${userName}.`);
    await refresh();
    setIsResolving(false);
  };

  if (!isOpen) return null;

  const isClosed = ticket?.status === "Concluído";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col">
        {isLoading || !ticket ? (
          <div className="flex flex-col items-center justify-center p-16">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-4" />
            <p className="text-slate-500 font-medium">Carregando...</p>
          </div>
        ) : (
          <>
            {/* Cabecalho */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div className="min-w-0 mr-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-orange-600 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-full px-2.5 py-1 mb-2">
                    <Tag className="w-3 h-3" />{ticket.ticket_number}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{ticket.title}</h2>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`${getStatusColor(ticket.status)} text-white text-xs font-semibold px-3 py-1.5 rounded-full`}>
                    {ticket.status}
                  </span>
                  <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Solicitante</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                    <User className="w-4 h-4 text-orange-500" />{ticket.requester}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Abertura</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-orange-500" />{formatDate(ticket.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Categoria</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{ticket.category}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Prioridade</p>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getPriorityBadge(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
                {ticket.assigned_to && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Tecnico Responsavel</p>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4" />{ticket.assigned_to}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Corpo */}
            <div className="p-6 space-y-6 flex-1">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Descricao</h3>
                <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-4 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  {ticket.description}
                </div>
              </div>
              <hr className="border-slate-100 dark:border-slate-700" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-orange-500" />
                  Historico
                  {ticket.interactions.length > 0 && (
                    <span className="ml-auto text-xs text-slate-400">{ticket.interactions.length} mensagem(s)</span>
                  )}
                </h3>
                {ticket.interactions.length === 0 ? (
                  <div className="text-center p-6 border border-dashed border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <p className="text-sm text-slate-400 italic">Nenhum comentario ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                    {ticket.interactions.map((msg) => {
                      const isOwn = msg.author === userName || msg.author === "Equipe de TI";
                      const isSystem = msg.author === "Sistema" || msg.author === "Sistema Automático";
                      return (
                        <div key={msg.id ?? `${msg.created_at}-${msg.author}`} className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                          <div className="text-xs text-slate-400 mb-1 mx-1">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">{msg.author}</span> {"\u2022"} {formatDate(msg.created_at ?? "")}
                          </div>
                          <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                            isOwn ? "bg-orange-500 text-white rounded-tr-sm"
                            : isSystem ? "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 italic rounded-tl-sm border border-slate-200 dark:border-slate-600"
                            : "bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                          }`}>{msg.text}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Acoes */}
            <div className="p-6 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700 rounded-b-2xl">
              {isClosed ? (
                <div className="flex flex-col items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
                  <CheckCircle className="w-6 h-6" />
                  <p className="font-semibold text-sm">Chamado concluido.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    placeholder="Escreva um comentario..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={isSending || isResolving}
                    rows={2}
                    className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all disabled:opacity-50 dark:text-white"
                  />
                  <div className="flex justify-between items-center gap-3">
                    {!readOnly && (
                      <div className="flex gap-2">
                        {!ticket.assigned_to && (
                          <button
                            onClick={handleAssign}
                            disabled={isAssigning || isSending}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-orange-500 text-orange-600 font-semibold text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors disabled:opacity-50"
                          >
                            {isAssigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                            Assumir
                          </button>
                        )}
                        <button
                          onClick={handleResolve}
                          disabled={isResolving || isSending}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-green-500 text-green-600 font-semibold text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-50"
                        >
                          {isResolving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          Concluir
                        </button>
                      </div>
                    )}
                    <div className="flex gap-2 ml-auto">
                      <button
                        onClick={handleSendComment}
                        disabled={!newComment.trim() || isSending || isResolving}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
