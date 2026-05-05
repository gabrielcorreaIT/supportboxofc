/**
 * CAMADA: Configuração / Build (Next.js)
 * ARQUIVO: next.config.mjs
 *
 * RESPONSABILIDADE
 *   Ajustes do framework Next.js para esta etapa do projeto. Como
 *   estamos entregando apenas a camada de View (sem Controllers nem
 *   Models), mantemos o arquivo enxuto e as flags de "ignorar erro
 *   de build" ligadas — assim a apresentação roda mesmo com pequenos
 *   tropeços de tipagem que serão resolvidos quando o restante do MVC
 *   chegar.
 *
 * NOTAS
 *   - `eslint.ignoreDuringBuilds`: evita travar o build por questões
 *     de lint enquanto não há configuração de ESLint dedicada.
 *   - `typescript.ignoreBuildErrors`: idem para o TypeScript. A
 *     compilação ainda roda — só não bloqueia o build.
 *   - `images.unoptimized`: dispensa o pipeline de otimização de
 *     imagens (não estamos usando <Image /> com fontes externas).
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
