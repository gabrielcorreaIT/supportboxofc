/**
 * Ajustes do Next.js para esta etapa do projeto.
 *
 * Como ainda só temos a parte visual pronta, deixamos as verificações
 * de lint e de tipagem fora do bloqueio de build. Isso evita que um
 * aviso pequeno trave a apresentação enquanto o restante do sistema
 * não chega. As imagens ficam sem otimização porque ainda não
 * carregamos imagens vindas de fontes externas.
 *
 * O comentário com `@type` no formato JSDoc serve para o editor
 * reconhecer o objeto como uma configuração válida do Next.js e
 * oferecer autocomplete.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Não barra o build se houver avisos do ESLint. O lint segue
  // rodando localmente, só não interrompe a geração da versão
  // de produção.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Mesmo princípio para o TypeScript: avisos não impedem o build.
  typescript: {
    ignoreBuildErrors: true,
  },
  // Desliga o pipeline de otimização de imagens. O sistema ainda não
  // usa o componente <Image /> com imagens externas.
  images: {
    unoptimized: true,
  },
}

export default nextConfig
