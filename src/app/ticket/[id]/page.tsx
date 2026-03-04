/**
 * ============================================================================
 * COMPONENTE: TicketDetailsPage (Detalhes do Chamado do Solicitante)
 * PROJETO: SupportBox
 * AUTOR: Gabriel
 * ============================================================================
 * DESCRIÇÃO:
 * Esta página exibe os detalhes de um chamado específico em tempo real.
 * Ela consome a Camada de Dados (db.ts) para buscar as informações do
 * Supabase, garantindo que o solicitante veja o status exato definido
 * pelo setor de TI (como a mudança para "Concluído" via Telegram).
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
import { db } from "../../../lib/db";

export default function TicketDetailsPage() {
  // =========================================================================
  // 1. ESTADOS DO COMPONENTE E ROTEAMENTO
  // =========================================================================
  const params = useParams();
  const router = useRouter();

  // Captura o ID da URL. Ex: se for /ticket/CH-468, ticketId = "CH-468"
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
        // Busca o chamado real no Supabase usando a nossa função do db.ts
        const chamadoReal = await db.getTicketById(ticketId);

        if (chamadoReal) {
          // Mescla os dados reais do banco com propriedades de UI que ainda
          // não possuem tabelas no banco (como o chat de interações).
          setTicket({
            ...chamadoReal,
            type: "incident", // Mock temporário para manter o ícone de alerta
            interactions: [], // Chat inicia vazio até criarmos a tabela de mensagens
          });
        } else {
          setTicket(null); // ID não existe, vai renderizar a tela de Erro 404
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

    // NOTA: Como o banco ainda não tem a tabela de 'comentários',
    // esta função apenas atualiza a tela visualmente de forma temporária.
    setTimeout(() => {
      const newInteraction = {
        id: ticket.interactions.length + 1,
        agent: "Colaborador Logado",
        date: new Date().toISOString(),
        message: newComment,
      };

      setTicket({
        ...ticket,
        interactions: [...ticket.interactions, newInteraction],
      });

      setNewComment("");
      setIsSendingComment(false);
    }, 1500);
  };

  // =========================================================================
  // 4. FUNÇÕES AUXILIARES E ADAPTAÇÕES DE BANCO
  // =========================================================================

  /** Formata a data. Se já vier formatada do nosso db.ts, apenas retorna. */
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    if (dateString.includes("/")) return dateString; // Já está no formato pt-BR

    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /** Retorna a cor com base nos status reais cadastrados no Supabase */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aguardando Atendimento":
        return "bg-blue-500"; // 🔵 AZUL
      case "Em Andamento":
        return "bg-indigo-500"; // 🟣 ROXO
      case "Concluído":
        return "bg-emerald-500"; // 🟢 VERDE
      default:
        return "bg-slate-400"; // ⚪ CINZA
    }
  };

  /** Retorna a cor com base nas prioridades reais cadastradas no Supabase */
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgente":
        return "bg-red-500";
      case "Alta":
        return "bg-orange-500";
      case "Média":
        return "bg-supportbox"; // Cor primária do sistema
      case "Baixa":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // =========================================================================
  // 5. RENDERIZAÇÃO DA INTERFACE (JSX)
  // =========================================================================

  // --- ESTADO 1: TELA DE CARREGAMENTO (LOADING) ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-supportbox/10 bg-white">
          <div className="container mx-auto py-4 px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/IconeLogo.jpg"
                alt="Logo SupportBox"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  SupportBox
                </h1>
                <p className="text-sm text-muted-foreground">Smart HelpDesk</p>
              </div>
            </div>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 container mx-auto py-6 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-supportbox"></div>
          </div>
        </main>
      </div>
    );
  }

  // --- ESTADO 2: TELA DE ERRO (CHAMADO NÃO ENCONTRADO - 404) ---
  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-supportbox/10 bg-white">
          <div className="container mx-auto py-4 px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/IconeLogo.jpg"
                alt="Logo SupportBox"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  SupportBox
                </h1>
                <p className="text-sm text-muted-foreground">Smart HelpDesk</p>
              </div>
            </div>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 container mx-auto py-6 px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Chamado não encontrado</h2>
            <p className="text-muted-foreground mb-4">
              O chamado solicitado não existe no banco de dados do setor de TI.
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-supportbox hover:bg-supportbox-dark"
            >
              Voltar ao Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // --- ESTADO 3: TELA PRINCIPAL DO CHAMADO (SUCESSO) ---
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-supportbox/10 bg-white">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/IconeLogo.jpg"
              alt="Logo SupportBox"
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
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="text-supportbox hover:text-supportbox-dark hover:bg-supportbox/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
        </div>

        <Card className="border-supportbox/20">
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
                  variant="secondary"
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
                <span>{ticket.interactions.length} interações</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-4">Histórico de Interações</h3>
              {ticket.interactions.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  Nenhum comentário adicionado a este chamado ainda.
                </p>
              ) : (
                <div className="space-y-4">
                  {ticket.interactions.map((interaction: any) => (
                    <div
                      key={interaction.id}
                      className="flex gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-supportbox/20 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-supportbox" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {interaction.agent}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(interaction.date)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {interaction.message}
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
                  disabled={isSendingComment || ticket.status === "Concluído"}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSendComment}
                    disabled={
                      !newComment.trim() ||
                      isSendingComment ||
                      ticket.status === "Concluído"
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

      <footer className="border-t border-supportbox/10 py-4 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 SupportBox. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
