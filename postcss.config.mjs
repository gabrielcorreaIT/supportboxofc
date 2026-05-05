/**
 * Configuração mínima para o PostCSS reconhecer as diretivas do
 * Tailwind dentro de globals.css. O Next.js já cuida do prefixo de
 * navegadores em produção, então não precisa de nada além disso.
 */
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
}

export default config
