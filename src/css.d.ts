/**
 * Declaração de tipo para a importação de CSS global em layout.tsx.
 * O Next.js cobre arquivos no formato CSS Modules, mas não os de
 * CSS global, então em modo mais rigoroso essa importação aparece
 * como erro sem esta declaração.
 */
declare module "*.css";
