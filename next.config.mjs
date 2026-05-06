/**
 * Ajustes do Next.js para esta etapa do projeto. Como só temos a
 * parte visual pronta, deixamos as verificações de lint e de tipagem
 * fora do bloqueio de build, e as imagens ficam sem otimização.
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
