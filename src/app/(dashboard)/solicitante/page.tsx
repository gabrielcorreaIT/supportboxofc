/**
 * [V] PAGE: Dashboard do Solicitante
 * ARQUIVO: src/app/(dashboard)/solicitante/page.tsx
 */
import { SolicitanteDashboard } from "@/views/ticket/SolicitanteDashboard";

export const metadata = {
  title: "Meus Chamados | SupportBox",
  description: "Abra e acompanhe seus chamados de TI",
};

export default function SolicitantePage() {
  return <SolicitanteDashboard />;
}
