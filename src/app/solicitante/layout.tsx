/**
 * Estrutura comum a todas as páginas dentro de /solicitante.
 *
 * Por ora só define a cor de fundo. O cabeçalho do solicitante
 * ficou junto com o painel para que o componente principal cuide
 * de tudo que aparece na tela.
 *
 * Mais para a frente, este é o lugar natural para incluir a
 * verificação de sessão, ou seja, conferir se o usuário está
 * realmente entrado e redirecioná-lo para a tela de entrada caso
 * contrário.
 */
export default function LayoutSolicitante({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-fundo">{children}</div>;
}
