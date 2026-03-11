/**
 * ============================================================================
 * 📦 COMPONENTE: TicketDetailsPage (Detalhes do Chamado do Solicitante)
 * 💻 PROJETO: SupportBox
 * 👨‍💻 DESENVOLVEDOR: Gabriel
 * ============================================================================
 * 📝 DESCRIÇÃO:
 * Esta página exibe os detalhes de um chamado específico em tempo real.
 * Ela consome a Camada de Dados (db.ts) para buscar as informações do
 * Supabase, garantindo que o solicitante veja o status exato definido
 * pelo setor de TI e agora carrega o Histórico de Interações (Chat) real
 * diretamente do banco de dados!
 * ============================================================================
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Clock,
  MessageSquare,
  Package,
  AlertTriangle,
  User,
  Send,
} from "lucide-react";
import { UserNav } from "@/components/user-nav";

// Importação da nossa camada de banco de dados real!
import { db } from "@/lib/db"; // Utilizando o path universal do Next.js

export default function TicketDetailsPage() {
  // =========================================================================
  // 1. ESTADOS DO COMPONENTE E ROTEAMENTO
  // =========================================================================
  const params = useParams();
  const router = useRouter();

  const ticketId = params.id as string;

  // Estados de Dados
  const [ticket, setTicket] = useState<any>(null);
  const [newComment, setNewComment] = useState("");

  // Estados de Interface (Feedback Visual)
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingComment, setIsSendingComment] = useState(false);

  // =========================================================================
  // 2. CICLO DE VIDA (BUSCA DOS DADOS REAIS NO BANCO)
  // =========================================================================
  useEffect(() => {
    async function carregarChamado() {
      setIsLoading(true);

      try {
        // Busca o chamado real e as mensagens reais simultaneamente
        const chamadoReal = await db.getTicketById(ticketId);
        const comentariosReais = await db.getTicketComments(ticketId);

        if (chamadoReal) {
          setTicket({
            ...chamadoReal,
            type: chamadoReal.type || "incident",
            interactions: comentariosReais || [], // AGORA PUXA DO BANCO!
          });
        } else {
          setTicket(null);
        }
      } catch (error) {
        console.error("Erro ao carregar os detalhes do chamado:", error);
        setTicket(null);
      } finally {
        setIsLoading(false);
      }
    }

    carregarChamado();
  }, [ticketId]);

  // =========================================================================
  // 3. FUNÇÕES DE AÇÃO (HANDLERS)
  // =========================================================================

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    setIsSendingComment(true);

    try {
      // 1. Salva de verdade no Supabase
      const success = await db.addTicketComment(
        ticketId,
        "Colaborador Logado",
        newComment,
      );

      if (success) {
        // 2. Se salvou, busca a lista atualizada para mostrar na tela na hora
        const comentariosAtualizados = await db.getTicketComments(ticketId);
        setTicket({
          ...ticket,
          interactions: comentariosAtualizados,
        });
        setNewComment(""); // Limpa o campo de texto
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setIsSendingComment(false);
    }
  };

  // =========================================================================
  // 4. FUNÇÕES AUXILIARES E ADAPTAÇÕES DE BANCO
  // =========================================================================

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    if (dateString.includes("/")) return dateString;

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
    switch (status) {
      case "Aguardando Atendimento":
      case "Pendente":
        return "bg-blue-500";
      case "Em Andamento":
        return "bg-indigo-500";
      case "Concluído":
      case "Resolvido":
        return "bg-emerald-500";
      default:
        return "bg-slate-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgente":
      case "Crítica":
        return "bg-red-500";
      case "Alta":
        return "bg-orange-500";
      case "Média":
        return "bg-supportbox";
      case "Baixa":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // =========================================================================
  // 5. RENDERIZAÇÃO DA INTERFACE (JSX)
  // =========================================================================

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header Loading Omitido por brevidade visual aqui */}
        <main className="flex-1 container mx-auto py-6 px-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-supportbox"></div>
        </main>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto py-6 px-4 text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Chamado não encontrado</h2>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-supportbox mt-4"
          >
            Voltar ao Dashboard
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-supportbox/10 bg-white">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/IconeLogo.jpg"
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">SupportBox</h1>
              <p className="text-sm text-muted-foreground">Smart HelpDesk</p>
            </div>
          </div>
          <UserNav />
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4 space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="text-supportbox"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>

        <Card className="border-supportbox/20 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-start">
                {ticket.type === "incident" ? (
                  <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
                ) : (
                  <Package className="h-6 w-6 text-supportbox mt-1" />
                )}
                <div>
                  <CardTitle className="text-2xl">{ticket.title}</CardTitle>
                  <CardDescription className="mt-2 text-base">
                    Solicitação {ticket.id} • Aberto por: {ticket.requester}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge
                  className={`${getPriorityColor(ticket.priority)} text-white`}
                >
                  {ticket.priority}
                </Badge>
                <Badge
                  className={`${getStatusColor(ticket.status)} text-white`}
                >
                  {ticket.status}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed">
                {ticket.description}
              </p>
            </div>

            <div className="flex items-center text-sm text-muted-foreground gap-6">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>Criado em {formatDate(ticket.date)}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>{ticket.interactions?.length || 0} interações</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-4">Histórico de Interações</h3>
              {!ticket.interactions || ticket.interactions.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  Nenhum comentário adicionado a este chamado ainda.
                </p>
              ) : (
                <div className="space-y-4">
                  {ticket.interactions.map((interaction: any) => (
                    <div
                      key={interaction.id}
                      className={`flex gap-3 p-4 rounded-lg ${interaction.author === "Equipe de TI" ? "bg-supportbox/5 border border-supportbox/10" : "bg-gray-50"}`}
                    >
                      <div className="flex-shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${interaction.author === "Equipe de TI" ? "bg-supportbox text-white" : "bg-supportbox/20 text-supportbox"}`}
                        >
                          <User className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-gray-900">
                            {interaction.author}{" "}
                            {/* Puxa da coluna 'author' do banco */}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(interaction.created_at)}{" "}
                            {/* Puxa da coluna 'created_at' do banco */}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {interaction.text}{" "}
                          {/* Puxa da coluna 'text' do banco */}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Adicionar Comentário</h3>
              <div className="space-y-3">
                <Textarea
                  placeholder="Digite seu comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] border-supportbox/20 focus:ring-supportbox/30"
                  disabled={
                    isSendingComment ||
                    ticket.status === "Concluído" ||
                    ticket.status === "Resolvido"
                  }
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSendComment}
                    disabled={
                      !newComment.trim() ||
                      isSendingComment ||
                      ticket.status === "Concluído" ||
                      ticket.status === "Resolvido"
                    }
                    className="bg-supportbox hover:bg-supportbox-dark"
                  >
                    {isSendingComment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" /> Enviar Comentário
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
