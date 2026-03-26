import { AgentSidebar } from "../../views/ticket/AgentSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar fixada na esquerda para toda a área (dashboard) */}
      <AgentSidebar />
      
      {/* Área principal conteudística onde as pages (ex: /agente) renderizam */}
      <main className="flex-1 overflow-y-auto w-full p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
