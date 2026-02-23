/**
 * ============================================================================
 * COMPONENTE: TicketDetailsPage (Detalhes do Chamado do Solicitante)
 * PROJETO: SupportBox
 * ============================================================================
 * * DESCRIÇÃO:
 * Esta página exibe os detalhes de um chamado específico selecionado pelo usuário.
 * Ela mostra a descrição original, os metadados (status, prioridade) e a
 * linha do tempo de interações (chat) entre o solicitante e o agente de TI.
 * Permite também que o usuário adicione novos comentários.
 * * * ARQUITETURA E ESTADO:
 * - Utiliza `useParams` do Next.js para capturar o ID do chamado na URL (ex: /chamados/T-1001).
 * - Utiliza estados de carregamento (Loading) para simular o tempo de resposta
 * de uma API real.
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

/**
 * =========================================================================
 * MOCK DATA: Bando de Dados Simulado
 * =========================================================================
 * Simula a resposta de uma API para detalhes de chamados.
 * A chave do objeto é o ID do chamado, facilitando a busca.
 */
const mockTicketDetails = {
  "T-1001": {
    id: "T-1001",
    title: "Não consigo acessar minha conta de e-mail",
    description:
      "Desde ontem pela manhã não consigo acessar minha conta de e-mail corporativo. Quando tento fazer login, aparece uma mensagem de erro dizendo que as credenciais estão incorretas, mas tenho certeza de que estou usando a senha correta. Já tentei redefinir a senha pelo portal, mas o problema persiste.",
    status: "open",
    priority: "high",
    category: "email",
    type: "incident",
    created: "2023-12-15T08:30:00Z",
    updated: "2023-12-15T10:00:00Z",
    interactions: [
      {
        id: 1,
        agent: "Ana Silva",
        date: "2023-12-15T08:45:00Z",
        message:
          "Olá! Recebi seu chamado e já estou investigando o problema. Vou verificar o status da sua conta no servidor de e-mail.",
      },
      {
        id: 2,
        agent: "Ana Silva",
        date: "2023-12-15T09:15:00Z",
        message:
          "Identifiquei que sua conta foi temporariamente bloqueada devido a múltiplas tentativas de login. Já desbloqueei sua conta. Por favor, tente acessar novamente.",
      },
      {
        id: 3,
        agent: "Gabriel Borges",
        date: "2023-12-15T09:45:00Z",
        message: "Ainda não consegui acessar. O erro continua aparecendo.",
      },
    ],
  },
  "T-1002": {
    id: "T-1002",
    title: "Solicitação de novo notebook",
    description:
      "Preciso de um novo notebook para trabalho remoto. Meu equipamento atual está muito lento e travando constantemente, o que está impactando minha produtividade. Gostaria de solicitar um notebook com configuração adequada para desenvolvimento de software.",
    status: "pending",
    priority: "medium",
    category: "hardware",
    type: "request",
    created: "2023-12-14T14:20:00Z",
    updated: "2023-12-15T09:00:00Z",
    interactions: [
      {
        id: 1,
        agent: "Carlos Santos",
        date: "2023-12-14T15:00:00Z",
        message:
          "Sua solicitação foi recebida. Vou encaminhar para aprovação da gerência e verificar a disponibilidade no estoque.",
      },
      {
        id: 2,
        agent: "Carlos Santos",
        date: "2023-12-15T09:00:00Z",
        message:
          "A solicitação foi aprovada! Temos um notebook Dell Latitude disponível. Vou preparar para entrega na próxima semana.",
      },
    ],
  },
};

export default function TicketDetailsPage() {
  // =========================================================================
  // 1. ESTADOS DO COMPONENTE E ROTEAMENTO
  // =========================================================================
  const params = useParams();
  const router = useRouter();

  // Captura o ID da URL. Ex: se for /chamado/T-1001, ticketId = "T-1001"
  const ticketId = params.id as string;

  // Estados de Dados
  const [ticket, setTicket] = useState<any>(null);
  const [newComment, setNewComment] = useState("");

  // Estados de Interface (Feedback Visual)
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingComment, setIsSendingComment] = useState(false);

  // =========================================================================
  // 2. CICLO DE VIDA (BUSCA DOS DADOS)
  // =========================================================================
  useEffect(() => {
    // Simula uma busca no banco de dados com delay de 1 segundo
    setTimeout(() => {
      const ticketData =
        mockTicketDetails[ticketId as keyof typeof mockTicketDetails];
      setTicket(ticketData || null);
      setIsLoading(false);
    }, 1000);
  }, [ticketId]);

  // =========================================================================
  // 3. FUNÇÕES DE AÇÃO (HANDLERS)
  // =========================================================================

  /**
   * handleSendComment: Simula o envio de uma nova mensagem no chat do chamado.
   * Adiciona o comentário na lista atual de interações do ticket.
   */
  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    setIsSendingComment(true);

    // Simula o tempo de rede para salvar a mensagem no banco
    setTimeout(() => {
      const newInteraction = {
        id: ticket.interactions.length + 1,
        agent: "Gabriel Borges", // Usuário mockado logado
        date: new Date().toISOString(),
        message: newComment,
      };

      setTicket({
        ...ticket,
        interactions: [...ticket.interactions, newInteraction],
      });

      setNewComment(""); // Limpa o campo de texto
      setIsSendingComment(false);
    }, 1500);
  };

  // =========================================================================
  // 4. FUNÇÕES AUXILIARES (FORMATADORES)
  // =========================================================================

  /** Formata a data do padrão ISO para o padrão brasileiro (DD/MM/AAAA HH:MM) */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /** Retorna a classe de cor (Tailwind) com base no Status do chamado */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500"; // 🔵 AZUL: Item novo, aguardando início.
      case "in-progress":
        return "bg-indigo-500"; // 🟣 ROXO: Em andamento.
      case "pending":
        return "bg-supportbox"; // 🟠 LARANJA: Pendente/Pausado.
      case "resolved":
        return "bg-emerald-500"; // 🟢 VERDE: Resolvido.
      default:
        return "bg-slate-400"; // ⚪ CINZA: Fallback
    }
  };

  /** Retorna a classe de cor (Tailwind) com base na Prioridade do chamado */
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-supportbox";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  /** Traduz o termo técnico do Status para o usuário final */
  const translateStatus = (status: string) => {
    switch (status) {
      case "open":
        return "Aberto";
      case "pending":
        return "Pendente";
      case "in-progress":
        return "Em Andamento";
      case "resolved":
        return "Resolvido";
      default:
        return status;
    }
  };

  /** Traduz o termo técnico da Prioridade para o usuário final */
  const translatePriority = (priority: string) => {
    switch (priority) {
      case "critical":
        return "Crítica";
      case "high":
        return "Alta";
      case "medium":
        return "Média";
      case "low":
        return "Baixa";
      default:
        return priority;
    }
  };

  // =========================================================================
  // 5. RENDERIZAÇÃO DA INTERFACE (JSX)
  // =========================================================================

  // --- ESTADO 1: TELA DE CARREGAMENTO (LOADING) ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header estático durante o loading */}
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
        {/* Spinner centralizado */}
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
        {/* Header estático do erro */}
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
        {/* Mensagem de Erro e Botão de Voltar */}
        <main className="flex-1 container mx-auto py-6 px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Chamado não encontrado</h2>
            <p className="text-muted-foreground mb-4">
              O chamado solicitado não existe ou foi removido.
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
      {/* --- CABEÇALHO GLOBAL --- */}
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

      {/* --- CONTEÚDO DA PÁGINA --- */}
      <main className="flex-1 container mx-auto py-6 px-4 space-y-6">
        {/* Botão de Voltar */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="text-supportbox hover:text-supportbox-dark hover:bg-supportbox/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
        </div>

        {/* --- CARTÃO DE DETALHES DO CHAMADO --- */}
        <Card className="border-supportbox/20">
          {/* Cabeçalho do Cartão (Título, Ícones e Badges de Status) */}
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-start">
                {/* Ícone condicional baseado no tipo do chamado */}
                {ticket.type === "incident" ? (
                  <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
                ) : (
                  <Package className="h-6 w-6 text-supportbox mt-1" />
                )}
                <div>
                  <CardTitle className="text-2xl">{ticket.title}</CardTitle>
                  <CardDescription className="mt-2 text-base">
                    {ticket.type === "incident" ? "Incidente" : "Solicitação"}{" "}
                    {ticket.id} • {ticket.category}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant="secondary"
                  className={`${getPriorityColor(ticket.priority)} text-white`}
                >
                  {translatePriority(ticket.priority)}
                </Badge>
                <Badge
                  className={`${getStatusColor(ticket.status)} text-white`}
                >
                  {translateStatus(ticket.status)}
                </Badge>
              </div>
            </div>
          </CardHeader>

          {/* Corpo do Cartão */}
          <CardContent className="space-y-6">
            {/* Descrição Original do Problema */}
            <div>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed">
                {ticket.description}
              </p>
            </div>

            {/* Metadados (Data de criação e Número de Interações) */}
            <div className="flex items-center text-sm text-muted-foreground gap-6">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>Criado em {formatDate(ticket.created)}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>{ticket.interactions.length} interações</span>
              </div>
            </div>

            <Separator />

            {/* --- LISTA DE INTERAÇÕES (TIMELINE/CHAT) --- */}
            <div>
              <h3 className="font-semibold mb-4">Histórico de Interações</h3>
              <div className="space-y-4">
                {ticket.interactions.map((interaction: any) => (
                  <div
                    key={interaction.id}
                    className="flex gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    {/* Avatar Padrão */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-supportbox/20 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-supportbox" />
                      </div>
                    </div>
                    {/* Mensagem e Dados do Autor */}
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
            </div>

            <Separator />

            {/* --- CAIXA DE NOVO COMENTÁRIO --- */}
            <div>
              <h3 className="font-semibold mb-3">Adicionar Comentário</h3>
              <div className="space-y-3">
                <Textarea
                  placeholder="Digite seu comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] border-supportbox/20 focus:ring-supportbox/30"
                  disabled={isSendingComment}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSendComment}
                    // Desabilita se o campo estiver vazio ou se estiver enviando
                    disabled={!newComment.trim() || isSendingComment}
                    className="bg-supportbox hover:bg-supportbox-dark"
                  >
                    {isSendingComment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Comentário
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* --- RODAPÉ GLOBAL --- */}
      <footer className="border-t border-supportbox/10 py-4 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 SupportBox. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
