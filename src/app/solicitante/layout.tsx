/**
 * CAMADA: View (rota Next.js — Layout do Solicitante)
 * ARQUIVO: src/app/solicitante/layout.tsx
 *
 * RESPONSABILIDADE
 *   Layout aplicado a todas as páginas dentro de "/solicitante".
 *   Por enquanto, apenas define o pano de fundo. No futuro, este é
 *   o ponto natural para adicionar a verificação de sessão (chamando
 *   o AuthController) e redirecionar para o login se necessário.
 */
export default function LayoutSolicitante({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-fundo">{children}</div>;
}
