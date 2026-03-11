/**
 * ============================================================================
 * 📦 ARQUIVO: src/app/ticket/[id]/page.tsx
 * 💻 PROJETO: SupportBox
 * 👨‍💻 DESENVOLVEDOR: Gabriel
 * 🏢 CONTEXTO: Sistema de comunicação entre um setor de TI e seus solicitantes
 * que abrem chamados.
 * * 📝 DESCRIÇÃO:
 * Página dinâmica responsável por exibir os detalhes completos de um chamado
 * específico (baseado no ID passado na URL). Ela consome os dados do Supabase
 * e inclui um módulo de comentários em tempo real para comunicação contínua
 * entre o colaborador que relatou o problema e o técnico de TI.
 * ============================================================================
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, Ticket, Comment } from "@/lib/db";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  Clock,
  User,
  MessageSquare,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function TicketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Carrega os dados do chamado e os comentários ao abrir a tela
  useEffect(() => {
    async function fetchData() {
      if (!ticketId) return;

      setIsLoading(true);
      try {
        const ticketData = await db.getTicketById(ticketId);
        if (ticketData) {
          setTicket(ticketData);
          const commentsData = await db.getTicketComments(ticketId);
          setComments(commentsData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados da página:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [ticketId]);

  // Função para enviar uma nova mensagem
  const handleSendComment = async () => {
    if (!newComment.trim() || !ticket) return;

    setIsSending(true);
    try {
      // Como estamos na visão do solicitante, cravamos o autor.
      // Em uma versão futura com login real, isso puxaria do usuário logado.
      const authorName = "Solicitante";

      const success = await db.addTicketComment(
        ticket.id,
        authorName,
        newComment,
      );

      if (success) {
        // Se deu certo no banco, atualiza a tela na hora com a nova mensagem
        const updatedComments = await db.getTicketComments(ticket.id);
        setComments(updatedComments);
        setNewComment(""); // Limpa o campo
      }
    } catch (error) {
      console.error("Falha ao enviar comentário:", error);
      alert("Houve um erro ao enviar sua mensagem. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "pendente" || s === "aguardando atendimento")
      return "bg-supportbox";
    if (s === "em andamento") return "bg-purple-500";
    if (s === "concluído" || s === "concluido" || s === "resolvido")
      return "bg-green-500";
    return "bg-gray-500";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-supportbox mb-4" />
        <p className="text-gray-500 font-medium text-lg">
          Carregando protocolo {ticketId}...
        </p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-900">
          Chamado não encontrado
        </h2>
        <p className="text-gray-500 max-w-md">
          O protocolo <strong>{ticketId}</strong> não existe ou foi removido do
          banco de dados.
        </p>
        <Button
          onClick={() => router.push("/dashboard")}
          className="mt-4 bg-supportbox"
        >
          Voltar ao Início
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Botão de Voltar */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="text-gray-500 hover:text-gray-900 -ml-4"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
      </Button>

      {/* Cabeçalho do Ticket */}
      <Card className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <p className="text-sm font-bold text-supportbox mb-1 tracking-wider">
                {ticket.id}
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                {ticket.title || "Incidente Relatado"}
              </h1>
            </div>
            <div className="flex gap-2">
              <Badge
                className={`${getStatusColor(ticket.status)} text-white px-3 py-1.5 text-sm uppercase`}
              >
                {ticket.status}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-700">
                {ticket.requester}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>
                {ticket.date ||
                  new Date(ticket.created_at!).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>
        </div>

        <CardContent className="p-6 sm:p-8">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
            Descrição do Problema
          </h3>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </div>
        </CardContent>
      </Card>

      {/* Seção de Comentários (Chat Bidirecional) */}
      <Card className="border border-gray-200 shadow-sm rounded-2xl">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-supportbox" /> Histórico de
            Comunicação
          </CardTitle>
          <CardDescription>
            Acompanhe as interações com a equipe de TI
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-400 font-medium">
              Nenhuma mensagem enviada ainda. Use o campo abaixo para detalhar
              mais informações.
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`flex flex-col ${msg.author === "Solicitante" ? "items-end" : "items-start"}`}
                >
                  <div className="text-xs text-gray-400 mb-1 ml-1 mr-1">
                    {msg.author} •{" "}
                    {new Date(msg.created_at!).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div
                    className={`px-5 py-3 rounded-2xl max-w-[85%] sm:max-w-[70%] text-sm leading-relaxed ${
                      msg.author === "Solicitante"
                        ? "bg-supportbox text-white rounded-tr-sm"
                        : "bg-gray-100 text-gray-800 rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        {/* Área de Input de Nova Mensagem */}
        <CardFooter className="p-6 bg-gray-50/50 border-t border-gray-100">
          <div className="flex w-full gap-3">
            <Textarea
              placeholder="Adicione um comentário ou anexo ao chamado..."
              className="resize-none bg-white border-gray-200 focus:ring-supportbox focus:border-supportbox min-h-[60px]"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendComment();
                }
              }}
            />
            <Button
              onClick={handleSendComment}
              disabled={!newComment.trim() || isSending}
              className="h-auto bg-supportbox hover:bg-supportbox-dark px-6"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
