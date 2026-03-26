import { TicketForm } from "../views/ticket/TicketForm";
import { ConditionalAIAgent } from "../views/ticket/conditional-ai-agent";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <TicketForm />
      </main>
      
      {/* Robô da IA que só aparece aqui na raiz ou outras telas liberadas */}
      <ConditionalAIAgent />
    </>
  );
}
