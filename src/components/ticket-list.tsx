"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MessageSquare, Package, Search, AlertTriangle } from "lucide-react"

// Dados fictícios para chamados
const mockTickets = [
  {
    id: "T-1001",
    title: "Não consigo acessar minha conta de e-mail",
    status: "open",
    priority: "high",
    category: "email",
    created: "2 horas atrás",
    updated: "30 minutos atrás",
    messages: 3,
    type: "incident",
  },
  {
    id: "T-1002",
    title: "Solicitação de novo notebook",
    status: "pending",
    priority: "medium",
    category: "hardware",
    created: "1 dia atrás",
    updated: "5 horas atrás",
    messages: 2,
    type: "request",
  },
  {
    id: "T-1003",
    title: "Problemas de conexão VPN",
    status: "in-progress",
    priority: "medium",
    category: "network",
    created: "3 dias atrás",
    updated: "1 dia atrás",
    messages: 5,
    type: "incident",
  },
  {
    id: "T-1004",
    title: "Solicitação de instalação de software",
    status: "resolved",
    priority: "low",
    category: "software",
    created: "1 semana atrás",
    updated: "2 dias atrás",
    messages: 4,
    type: "request",
  },
]

export default function TicketList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const router = useRouter()

  // Filtrar chamados com base na consulta de pesquisa, filtro de status e tipo
  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "all" || ticket.status === filter
    const matchesType = typeFilter === "all" || ticket.type === typeFilter

    return matchesSearch && matchesFilter && matchesType
  })

  // Obter cor do badge de status
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

  // Obter cor do badge de prioridade
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

  // Traduzir status para português
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

  // Traduzir prioridade para português
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

  const handleViewDetails = (ticketId: string) => {
    router.push(`/ticket/${ticketId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar chamados..."
              className="w-full sm:w-[300px] pl-8 border-supportbox/20 focus:ring-supportbox/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setFilter}>
            <TabsList className="bg-muted/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-supportbox data-[state=active]:text-white">
                Todos
              </TabsTrigger>
              <TabsTrigger value="open" className="data-[state=active]:bg-supportbox data-[state=active]:text-white">
                Abertos
              </TabsTrigger>
              <TabsTrigger
                value="in-progress"
                className="data-[state=active]:bg-supportbox data-[state=active]:text-white"
              >
                Em Andamento
              </TabsTrigger>
              <TabsTrigger
                value="resolved"
                className="data-[state=active]:bg-supportbox data-[state=active]:text-white"
              >
                Resolvidos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex justify-start">
          <Tabs defaultValue="all" className="w-auto" onValueChange={setTypeFilter}>
            <TabsList className="bg-muted/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-supportbox data-[state=active]:text-white">
                Todos os Tipos
              </TabsTrigger>
              <TabsTrigger value="request" className="data-[state=active]:bg-supportbox data-[state=active]:text-white">
                Solicitações
              </TabsTrigger>
              <TabsTrigger
                value="incident"
                className="data-[state=active]:bg-supportbox data-[state=active]:text-white"
              >
                Incidentes
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <Card className="border-supportbox/20">
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <p className="text-muted-foreground">Nenhum chamado encontrado com os critérios selecionados.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="overflow-hidden border-supportbox/20 hover:border-supportbox/40 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2 items-start">
                    {ticket.type === "incident" ? (
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-1" />
                    ) : (
                      <Package className="h-5 w-5 text-supportbox mt-1" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{ticket.title}</CardTitle>
                      <CardDescription className="mt-1">
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
              <CardContent className="pb-3">
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>Criado {ticket.created}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="mr-1 h-3 w-3" />
                    <span>{ticket.messages} mensagens</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-supportbox/10 pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-supportbox hover:text-supportbox-dark hover:bg-supportbox/10"
                  onClick={() => handleViewDetails(ticket.id)}
                >
                  Ver Detalhes
                </Button>
                {ticket.status !== "resolved" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-supportbox/20 text-supportbox hover:text-supportbox-dark hover:bg-supportbox/10 bg-transparent"
                    onClick={() => handleViewDetails(ticket.id)}
                  >
                    Adicionar Comentário
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
