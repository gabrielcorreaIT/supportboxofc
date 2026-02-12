"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, MessageSquare, Package, AlertTriangle, User, Send } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import { ServerLogo } from "@/components/server-logo"

// Mock data para detalhes do chamado
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
}

export default function TicketDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.id as string
  const [ticket, setTicket] = useState<any>(null)
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSendingComment, setIsSendingComment] = useState(false)

  useEffect(() => {
    // Simular carregamento dos dados
    setTimeout(() => {
      const ticketData = mockTicketDetails[ticketId as keyof typeof mockTicketDetails]
      setTicket(ticketData || null)
      setIsLoading(false)
    }, 1000)
  }, [ticketId])

  const handleSendComment = async () => {
    if (!newComment.trim()) return

    setIsSendingComment(true)

    // Simular envio do comentário
    setTimeout(() => {
      const newInteraction = {
        id: ticket.interactions.length + 1,
        agent: "Gabriel Borges",
        date: new Date().toISOString(),
        message: newComment,
      }

      setTicket({
        ...ticket,
        interactions: [...ticket.interactions, newInteraction],
      })

      setNewComment("")
      setIsSendingComment(false)
    }, 1500)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500"
      case "pending":
        return "bg-supportbox"
      case "in-progress":
        return "bg-purple-500"
      case "resolved":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-supportbox"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const translateStatus = (status: string) => {
    switch (status) {
      case "open":
        return "Aberto"
      case "pending":
        return "Pendente"
      case "in-progress":
        return "Em Andamento"
      case "resolved":
        return "Resolvido"
      default:
        return status
    }
  }

  const translatePriority = (priority: string) => {
    switch (priority) {
      case "critical":
        return "Crítica"
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      case "low":
        return "Baixa"
      default:
        return priority
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-supportbox/10 bg-white">
          <div className="container mx-auto py-4 px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ServerLogo size={50} />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">SupportBox</h1>
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
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-supportbox/10 bg-white">
          <div className="container mx-auto py-4 px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ServerLogo size={50} />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">SupportBox</h1>
                <p className="text-sm text-muted-foreground">Smart HelpDesk</p>
              </div>
            </div>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 container mx-auto py-6 px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Chamado não encontrado</h2>
            <p className="text-muted-foreground mb-4">O chamado solicitado não existe ou foi removido.</p>
            <Button onClick={() => router.push("/dashboard")} className="bg-supportbox hover:bg-supportbox-dark">
              Voltar ao Dashboard
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-supportbox/10 bg-white">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ServerLogo size={50} />
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
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
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
                    {ticket.type === "incident" ? "Incidente" : "Solicitação"} {ticket.id} • {ticket.category}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className={`${getPriorityColor(ticket.priority)} text-white`}>
                  {translatePriority(ticket.priority)}
                </Badge>
                <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                  {translateStatus(ticket.status)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed">{ticket.description}</p>
            </div>

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

            <div>
              <h3 className="font-semibold mb-4">Histórico de Interações</h3>
              <div className="space-y-4">
                {ticket.interactions.map((interaction: any) => (
                  <div key={interaction.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-supportbox/20 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-supportbox" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{interaction.agent}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(interaction.date)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{interaction.message}</p>
                    </div>
                  </div>
                ))}
              </div>
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
                  disabled={isSendingComment}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSendComment}
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

      <footer className="border-t border-supportbox/10 py-4 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2023 SupportBox. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
