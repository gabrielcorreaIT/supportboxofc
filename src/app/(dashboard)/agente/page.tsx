/**
 * [V] PAGE: Painel do Agente
 * ARQUIVO: src/app/(dashboard)/agente/page.tsx
 */
import TicketList from "@/views/ticket/ticket-list";

export const metadata = {
  title: "Painel do Agente | SupportBox",
  description: "Gerenciamento de chamados de TI",
};

export default function AgenteDashboardPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Painel de Controle</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Visao geral de todos os chamados ativos.</p>
      </div>
      <TicketList />
    </div>
  );
}
