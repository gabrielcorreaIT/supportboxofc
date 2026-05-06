/**
 * Estrutura comum às páginas do solicitante. Por ora só define a cor
 * de fundo. Mais para a frente é aqui que entra a verificação de
 * sessão.
 */
export default function LayoutSolicitante({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-fundo">{children}</div>;
}
