import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TicketForm from "@/components/ticket-form"
import TicketList from "@/components/ticket-list"
import { UserNav } from "@/components/user-nav"
import { ServerLogo } from "@/components/server-logo"

export default function Dashboard() {
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

      <main className="flex-1 container mx-auto py-6 px-4 space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Central de Suporte</h2>
          <p className="text-muted-foreground">Envie e acompanhe suas solicitações e incidentes de suporte de TI</p>
        </div>

        <Tabs defaultValue="new-ticket" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger
              value="new-ticket"
              className="data-[state=active]:bg-supportbox data-[state=active]:text-white"
            >
              Novo Chamado
            </TabsTrigger>
            <TabsTrigger
              value="my-tickets"
              className="data-[state=active]:bg-supportbox data-[state=active]:text-white"
            >
              Meus Chamados
            </TabsTrigger>
          </TabsList>
          <TabsContent value="new-ticket" className="mt-6">
            <TicketForm />
          </TabsContent>
          <TabsContent value="my-tickets" className="mt-6">
            <TicketList />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-supportbox/10 py-4 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2023 SupportBox. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
