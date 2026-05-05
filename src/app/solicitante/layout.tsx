/**
 * Estrutura usada por todas as páginas do solicitante.
 *
 * Por enquanto define apenas a cor de fundo. Mais para a frente este
 * é o lugar natural para verificar se o usuário está realmente
 * autenticado e mandar de volta para a tela de entrada quando não
 * estiver.
 */
export default function LayoutSolicitante({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-fundo">{children}</div>;
}
