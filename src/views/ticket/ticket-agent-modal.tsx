/**
 * ============================================================================
 * 📦 COMPONENTE: TicketAgentModal (Modal de Detalhes para o Agente)
 * 💻 PROJETO: SupportBox
 * 👨‍💻 DESENVOLVEDOR: Gabriel
 * ============================================================================
 * 📝 DESCRIÇÃO:
 * Este componente renderiza um Modal (Dialog) rico para o Portal do Agente.
 * Ele permite que a equipe de TI visualize todos os detalhes de um chamado,
 * acompanhe o histórico de mensagens em tempo real e adicione novas respostas
 * ou altere o status do chamado diretamente pela interface web.
 * ============================================================================
 */

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  MessageSquare,
  User,
  Send,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Package,
} from "lucide-react";

import { 
  getTicketDetailsAction, 
  addTicketCommentAction 
} from "@/controllers/TicketController";


interface TicketAgentModalProps {
  ticketId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onTicketUpdated?: () => void; // Callback para atualizar a tabela por trás quando houver mudanças
}

export function TicketAgentModal({
  ticketId,
  isOpen,
  onClose,
  onTicketUpdated,
}: TicketAgentModalProps) {
  const [ticket, setTicket] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
  async function loadTicketData() {
    if (!ticketId || !isOpen) return;

    setIsLoading(true);
    // Chamando o Controller em vez do DB
    const result = await getTicketDetailsAction(ticketId); 

    if (result.success && result.data) {
      setTicket(result.data);
    }
    setIsLoading(false);
  }
  loadTicketData();
}, [ticketId, isOpen]);


  // Função para a TI enviar uma resposta manual
  const handleSendComment = async () => {
    if (!newComment.trim() || !ticketId) return;

    setIsSending(true);
    try {
      // Como é o portal do agente, o autor é a Equipe de TI
      const result = await addTicketCommentAction(ticketId, "Equipe de TI", newComment);

      if (result.success) {
        const comentariosAtualizados = await db.getTicketComments(ticketId);
        setTicket({ ...ticket, interactions: comentariosAtualizados });
        setNewComment("");
        if (onTicketUpdated) onTicketUpdated(); // Avisa a tabela de trás para atualizar contadores
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Função para a TI concluir o chamado pelo botão da interface
  const handleResolveTicket = async () => {
    if (!ticketId) return;

    setIsResolving(true);
    try {
      await db.updateTicketStatus(ticketId, "Concluído");
      await db.addTicketComment(
        ticketId,
        "Sistema Automático",
        "Chamado encerrado pelo Agente via Portal Web.",
      );

      // Atualiza o estado local para refletir a mudança instantaneamente
      const chamadoReal = await db.getTicketById(ticketId);
      const comentariosReais = await db.getTicketComments(ticketId);
      setTicket({ ...chamadoReal, interactions: comentariosReais || [] });

      if (onTicketUpdated) onTicketUpdated();
    } catch (error) {
      console.error("Erro ao resolver chamado:", error);
    } finally {
      setIsResolving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "pendente" || s === "aguardando atendimento")
      return "bg-supportbox";
    if (s === "em andamento") return "bg-purple-500";
    if (s === "concluído" || s === "resolvido") return "bg-green-500";
    return "bg-gray-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gray-50/50 p-0 border-0 shadow-2xl rounded-2xl">
        {isLoading || !ticket ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white">
            <Loader2 className="h-8 w-8 animate-spin text-supportbox mb-4" />
            <p className="text-gray-500 font-medium">
              Carregando dados do protocolo...
            </p>
          </div>
        ) : (
          <div className="flex flex-col bg-white">
            {/* CABEÇALHO DO MODAL */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Badge
                    variant="outline"
                    className="mb-2 text-supportbox border-supportbox/30 bg-supportbox/5"
                  >
                    {ticket.id}
                  </Badge>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    {ticket.title}
                  </DialogTitle>
                </div>
                <Badge
                  className={`${getStatusColor(ticket.status)} text-white px-3 py-1`}
                >
                  {ticket.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                    Solicitante
                  </p>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-supportbox" />{" "}
                    {ticket.requester}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                    Data de Abertura
                  </p>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-supportbox" />{" "}
                    {formatDate(ticket.date || ticket.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* CORPO DO MODAL */}
            <div className="p-6 space-y-6">
              {/* Descrição Original */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">
                  Descrição do Problema
                </h3>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-gray-700 text-sm leading-relaxed shadow-sm">
                  {ticket.description}
                </div>
              </div>

              <Separator />

              {/* Linha do Tempo / Chat */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-supportbox" />{" "}
                  Histórico de Interações
                </h3>

                {!ticket.interactions || ticket.interactions.length === 0 ? (
                  <div className="text-center p-6 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                    <p className="text-sm text-gray-500 italic">
                      Nenhum comentário adicionado a este chamado ainda.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {ticket.interactions.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.author === "Equipe de TI" ? "items-end" : "items-start"}`}
                      >
                        <div className="text-xs text-gray-400 mb-1 mx-1">
                          <span className="font-semibold text-gray-600">
                            {msg.author}
                          </span>{" "}
                          • {formatDate(msg.created_at)}
                        </div>
                        <div
                          className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                            msg.author === "Equipe de TI"
                              ? "bg-supportbox text-white rounded-tr-sm"
                              : "bg-gray-100 border border-gray-200 text-gray-800 rounded-tl-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ÁREA DE RESPOSTA E AÇÕES */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
              {ticket.status === "Concluído" ||
              ticket.status === "Resolvido" ? (
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex flex-col items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  <p className="font-semibold">
                    Este chamado já foi concluído.
                  </p>
                  <p className="text-xs">
                    Não é possível adicionar novos comentários.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Escreva uma resposta para o solicitante..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px] border-gray-200 focus:border-supportbox focus:ring-supportbox bg-white resize-none"
                    disabled={isSending || isResolving}
                  />
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={handleResolveTicket}
                      disabled={isResolving || isSending}
                      className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 font-semibold"
                    >
                      {isResolving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Marcar como Concluído
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isSending}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSendComment}
                        disabled={!newComment.trim() || isSending}
                        className="bg-supportbox hover:bg-supportbox-dark"
                      >
                        {isSending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        Enviar Resposta
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
