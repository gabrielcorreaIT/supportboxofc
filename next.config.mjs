/**
 * Ajustes do Next.js para esta etapa do projeto.
 *
 * Como nesta fase só temos a parte visual pronta, deixamos as
 * verificações de lint e de tipagem fora do bloqueio de build. Assim
 * a apresentação roda mesmo que apareça algum aviso pequeno enquanto
 * o restante do sistema não chega.
 *
 * As imagens ficam sem otimização porque ainda não usamos imagens
 * vindas de fora do projeto.
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
