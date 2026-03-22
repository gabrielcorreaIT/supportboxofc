
/**
 * ============================================================================
 * 📦 ARQUIVO: ticket-list.tsx
 * 💻 PROJETO: SupportBox
 * * 📝 DESCRIÇÃO:
 * Este componente é responsável por renderizar a lista dinâmica de chamados
 * no Portal do Agente (Painel da TI). Ele abandona os dados mockados e
 * realiza uma busca em tempo real no banco de dados (Supabase) assim que a
 * tela é montada, exibindo os protocolos abertos pelos solicitantes.
 * * ⚙️ FUNCIONALIDADES:
 * - Busca de dados assíncrona (useEffect) via `db.getTickets()`.
 * - Estado de Loading (Loader2) para feedback visual durante a requisição.
 * - Filtros em tempo real por Status (Pendente/Concluído) e texto.
 * - Mapeamento dinâmico de cores de Badges baseadas no status real do banco.
 * ============================================================================
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDashboardDataAction } from "@/controllers/TicketController";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  MessageSquare,
  Package,
  Search,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export default function TicketList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Novos estados para o Banco de Dados Real
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Busca os dados reais do Supabase assim que a tela abre
  useEffect(() => {
    async function fetchTickets() {
      try {
        setIsLoading(true);
        // Chama a ação do Controller (Maestro) em vez do banco direto
        const result = await getDashboardDataAction();
        if (result.success && result.data) {
          setTickets(result.data.tickets || []);
        }
      } catch (error) {
        console.error("Erro ao carregar chamados da nuvem:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTickets();
  }, []);

  // Filtrar chamados com base na pesquisa, status e tipo
  const filteredTickets = tickets.filter((ticket) => {
    // Alguns bancos usam 'title', outros 'description'. Usamos fallback para os dois.
    const tituloBusca = (
      ticket.title ||
      ticket.description ||
      ""
    ).toLowerCase();
    const idBusca = (ticket.id || "").toLowerCase();
    const statusTicket = (ticket.status || "").toLowerCase();

    const matchesSearch =
      tituloBusca.includes(searchQuery.toLowerCase()) ||
      idBusca.includes(searchQuery.toLowerCase());

    // Ajuste dos filtros para os status reais do nosso sistema
    let matchesFilter = filter === "all";
    if (
      filter === "pending" &&
      (statusTicket === "pendente" || statusTicket === "pending")
    )
      matchesFilter = true;
    if (
      filter === "resolved" &&
      (statusTicket === "concluído" ||
        statusTicket === "concluido" ||
        statusTicket === "resolved")
    )
      matchesFilter = true;
    if (filter === "in-progress" && statusTicket === "em andamento")
      matchesFilter = true;

    // Se não tiver tipo no banco, assumimos 'incident'
    const ticketType = ticket.type || "incident";
    const matchesType = typeFilter === "all" || ticketType === typeFilter;

    return matchesSearch && matchesFilter && matchesType;
  });

  // Obter cor do badge de status dinamicamente
  const getStatusColor = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "pendente" || s === "aguardando") return "bg-supportbox";
    if (s === "em andamento") return "bg-purple-500";
    if (s === "concluído" || s === "concluido" || s === "resolvido")
      return "bg-green-500";
    return "bg-gray-500";
  };

  // Obter cor do badge de prioridade
  const getPriorityColor = (priority: string) => {
    const p = (priority || "").toLowerCase();
    if (p === "critical" || p === "crítica") return "bg-red-500";
    if (p === "high" || p === "alta") return "bg-orange-500";
    if (p === "low" || p === "baixa") return "bg-green-500";
    return "bg-supportbox"; // Padrão é média
  };

  // Formatar data real vinda do banco (ex: created_at)
  const formatData = (dataString: string) => {
    if (!dataString) return "Data desconhecida";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetails = (ticketId: string) => {
    router.push(`/ticket/${ticketId}`);
  };

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

          <Tabs
            defaultValue="all"
            className="w-full sm:w-auto"
            onValueChange={setFilter}
          >
            <TabsList className="bg-muted/50">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-supportbox data-[state=active]:text-white"
              >
                Todos
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-supportbox data-[state=active]:text-white"
              >
                Pendentes
              </TabsTrigger>
              <TabsTrigger
                value="resolved"
                className="data-[state=active]:bg-supportbox data-[state=active]:text-white"
              >
                Concluídos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* --- ESTADO DE CARREGANDO --- */}
      {isLoading ? (
        <Card className="border-supportbox/20">
          <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-supportbox mb-4" />
            <p className="text-muted-foreground font-medium">
              Buscando chamados no banco de dados...
            </p>
          </CardContent>
        </Card>
      ) : filteredTickets.length === 0 ? (
        <Card className="border-supportbox/20">
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-muted-foreground text-lg">
                Nenhum chamado encontrado com os critérios selecionados.
              </p>
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
                    {/* fallback para caso não exista o campo type no banco */}
                    {(ticket.type || "incident") === "incident" ? (
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-1" />
                    ) : (
                      <Package className="h-5 w-5 text-supportbox mt-1" />
                    )}
                    <div>
                      {/* Mostrar titulo ou parte da descrição */}
                      <CardTitle className="text-lg">
                        {ticket.title ||
                          ticket.description ||
                          "Chamado sem descrição"}
                      </CardTitle>
                      <CardDescription className="mt-1 font-medium text-gray-500">
                        {ticket.id} • {ticket.category || "Sem categoria"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant="secondary"
                      className={`${getPriorityColor(ticket.priority)} text-white`}
                    >
                      {ticket.priority || "Média"}
                    </Badge>
                    <Badge
                      className={`${getStatusColor(ticket.status)} text-white px-3 py-1 font-semibold uppercase tracking-wider text-xs`}
                    >
                      {ticket.status || "Pendente"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <div className="flex items-center font-medium">
                    <Clock className="mr-1.5 h-4 w-4 text-supportbox/70" />
                    {/* formata a data de created_at vinda do Supabase */}
                    <span>
                      Criado em{" "}
                      {formatData(ticket.created_at || ticket.created)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-supportbox/10 pt-3 bg-gray-50/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-supportbox hover:text-supportbox-dark hover:bg-supportbox/10"
                  onClick={() => handleViewDetails(ticket.id)}
                >
                  Ver Detalhes do Protocolo
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
