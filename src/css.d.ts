/**
 * Declaração de tipo para a importação de CSS global.
 *
 * O Next.js já vem com declarações para arquivos no formato CSS
 * Modules (aqueles com a extensão .module.css), mas não cobre os
 * arquivos de CSS global, como o globals.css importado em
 * layout.tsx. Quando o verificador de tipos roda em modo mais
 * rigoroso, esse import sem declaração aparece como erro.
 *
 * Esta linha resolve o problema dizendo ao TypeScript que qualquer
 * arquivo .css pode ser importado. Quem processa o CSS de fato
 * continua sendo o Next.js junto com o PostCSS e o Tailwind.
 */
declare module "*.css";
