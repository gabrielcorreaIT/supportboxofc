/**
 * CAMADA: View (Page) — Dashboard do Solicitante
 * ARQUIVO: src/app/(dashboard)/solicitante/page.tsx
 *
 * DESCRICAO:
 *   Pagina principal do solicitante. Renderiza o PainelSolicitante,
 *   que contem formulario de abertura, lista de chamados e chatbot IA.
 *
 * CONEXOES:
 *   - Depende de: PainelSolicitante (componente orquestrador)
 *   - Protegida pelo middleware (requer autenticacao)
 */
import { PainelSolicitante } from "@/views/ticket/SolicitanteDashboard";

export const metadata = {
  title: "Meus Chamados | SupportBox",
  description: "Abra e acompanhe seus chamados de TI",
};

export default function PaginaSolicitante() {
  return <PainelSolicitante />;
}
