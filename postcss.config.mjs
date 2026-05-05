/**
 * CAMADA: Configuração / Build (PostCSS)
 * ARQUIVO: postcss.config.mjs
 *
 * RESPONSABILIDADE
 *   Configuração mínima do PostCSS para que o Tailwind processe as
 *   diretivas de `globals.css`. Não precisamos de Autoprefixer
 *   explícito — o Next.js já o aplica internamente em produção.
 */
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
}

export default config
