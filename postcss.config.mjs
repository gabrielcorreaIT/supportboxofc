/**
 * Configuração mínima do PostCSS.
 *
 * O Next.js usa o PostCSS como motor de transformação dos arquivos
 * de CSS. Aqui registramos apenas o plugin do Tailwind, que é o
 * responsável por interpretar as diretivas presentes em globals.css
 * e gerar as classes utilitárias. O prefixo automático para
 * navegadores antigos já vem cuidado pelo próprio Next.js, então não
 * precisamos do Autoprefixer aqui.
 */
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
}

export default config
