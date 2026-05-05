/**
 * Declaração de tipo para imports de arquivos CSS globais.
 *
 * O Next.js já cobre arquivos no formato de CSS Modules, mas não os
 * arquivos de CSS global. Quando o verificador de tipos roda em modo
 * mais rigoroso, a importação de globals.css em layout.tsx aparece
 * como erro. Esta declaração resolve isso. Quem processa o CSS de
 * fato continua sendo o Next.js junto com o PostCSS e o Tailwind.
 */
declare module "*.css";
