import TicketList from "../../../views/ticket/ticket-list";

export const metadata = {
  title: "Painel do Agente | SupportBox",
  description: "Gerenciamento de chamados de TI",
};

export default function AgenteDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Painel de Controle
        </h1>
        <p className="text-slate-500 mt-2">
          Visão geral de todos os chamados ativos no sistema.
        </p>
      </div>
      
      {/* Aqui a View de Negócio atua consumindo nosso Controller internamente */}
      <TicketList />
    </div>
  );
}