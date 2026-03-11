/**
 * ============================================================================
 * 📦 ARQUIVO: src/app/page.tsx (Página Raiz)
 * 💻 PROJETO: SupportBox
 * 👨‍💻 DESENVOLVEDOR: Gabriel
 * 🏢 CONTEXTO: Sistema de comunicação entre um setor de TI e seus solicitantes.
 * ============================================================================
 * 📝 DESCRIÇÃO:
 * Este é o arquivo de entrada principal da aplicação web (a rota "/").
 * * ⚙️ FUNCIONAMENTO:
 * Como o SupportBox é um sistema interno e não possui uma "Landing Page"
 * pública com propagandas, não há necessidade de renderizar uma interface aqui.
 * A função exclusiva deste arquivo é atuar como um "Controlador de Tráfego".
 * Ele intercepta qualquer usuário que acesse o domínio vazio (ex: localhost:3000
 * ou supportboxofc.vercel.app) e o redireciona imediatamente (Server-Side)
 * para a tela de login.
 * ============================================================================
 */

// Importa a função 'redirect' nativa do App Router do Next.js.
// Diferente do 'useRouter', o 'redirect' funciona no lado do servidor,
// tornando o redirecionamento instantâneo antes mesmo da página carregar.
import { redirect } from "next/navigation";

// Declaração do componente funcional padrão para a rota raiz
export default function HomePage() {
  // A execução do 'redirect' interrompe qualquer tentativa de renderizar
  // esta página e envia o navegador do usuário para a rota "/login".
  // Observação: Caso a tela inicial principal mude no futuro (ex: "/agente"),
  // basta alterar o caminho da string abaixo.
  redirect("/login");
}
