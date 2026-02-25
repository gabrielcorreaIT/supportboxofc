import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TicketForm from "@/components/ticket-form";
import TicketList from "@/components/ticket-list";
import { UserNav } from "@/components/user-nav";
import {
  LayoutDashboard,
  PlusCircle,
  HeadphonesIcon,
  LifeBuoy,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] relative">
      {/* --- BACKGROUND ESTRUTURAL MODERNIZADO --- */}
      {/* 1. Gradiente de cor da marca que desce do topo */}
      <div className="absolute top-0 left-0 w-full h-[320px] bg-gradient-to-b from-supportbox/15 via-supportbox/5 to-transparent pointer-events-none z-0" />

      {/* 2. Padrão sutil de pontos (Tech Dots) para dar textura ao fundo */}
      <div className="absolute top-0 left-0 w-full h-[320px] opacity-[0.04] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

      {/* --- CABEÇALHO --- */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm transition-all">
        <div className="container mx-auto py-3 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
              <img
                src="/IconeLogo.jpg"
                alt="Logo SupportBox"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
                SupportBox
              </h1>
              <p className="text-xs font-medium text-supportbox flex items-center gap-1">
                <LifeBuoy className="w-3 h-3" /> Smart HelpDesk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right mr-1">
              <p className="text-sm font-semibold text-gray-900">
                Portal do Solicitante
              </p>
              <p className="text-xs text-gray-500 font-medium">Nome Empresa</p>
            </div>
            {/* Ring colorido em volta da foto do usuário */}
            <div className="p-0.5 bg-gradient-to-br from-supportbox/40 to-supportbox rounded-full shadow-sm">
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      {/* O pb-28 (padding bottom) aqui evita que o chat fique em cima dos cartões no fim da página */}
      <main className="flex-1 container mx-auto pt-10 pb-28 px-4 relative z-10">
        {/* Área de Título encaixada no background */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Central de Suporte
          </h2>
          <p className="text-base text-gray-600 mt-2 max-w-2xl">
            Envie novas solicitações para a equipe técnica ou acompanhe o
            andamento dos incidentes já registrados.
          </p>
        </div>

        {/* --- TABS MODERNIZADAS --- */}
        <Tabs
          defaultValue="new-ticket"
          className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <div className="mb-8">
            {/* Caixa branca ao redor das abas */}
            <TabsList className="inline-flex h-14 items-center justify-center rounded-2xl bg-white p-1.5 shadow-sm border border-gray-200/60">
              <TabsTrigger
                value="new-ticket"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-2.5 text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-supportbox/10 data-[state=active]:text-supportbox data-[state=active]:shadow-none text-gray-500 hover:text-gray-700 gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Novo Chamado
              </TabsTrigger>

              <TabsTrigger
                value="my-tickets"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-2.5 text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-supportbox/10 data-[state=active]:text-supportbox data-[state=active]:shadow-none text-gray-500 hover:text-gray-700 gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Meus Chamados
              </TabsTrigger>
            </TabsList>
          </div>

          {/* O componente TicketForm cuida sozinho de estar centralizado no meio da tela */}
          <TabsContent
            value="new-ticket"
            className="focus-visible:outline-none"
          >
            <TicketForm />
          </TabsContent>
          <TabsContent
            value="my-tickets"
            className="focus-visible:outline-none"
          >
            <TicketList />
          </TabsContent>
        </Tabs>
      </main>

      {/* --- RODAPÉ (FOOTER) CORRIGIDO --- */}
      {/* Removemos o 'backdrop-blur' e o z-index alto para o widget de chat flutuar livremente */}
      <footer className="border-t border-gray-200 bg-white py-8 mt-auto relative z-0">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400 font-medium">
          © 2026 SupportBox. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
