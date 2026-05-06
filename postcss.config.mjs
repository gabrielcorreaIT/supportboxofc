/**
 * Configuração mínima do PostCSS para o Tailwind funcionar dentro
 * de globals.css.
 */
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
}

export default config
