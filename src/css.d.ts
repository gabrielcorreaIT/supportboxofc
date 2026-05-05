/**
 * CAMADA: Tipos auxiliares (declaração de módulo)
 * ARQUIVO: src/css.d.ts
 *
 * RESPONSABILIDADE
 *   Declarar o "shape" de uma importação de CSS global feita por
 *   efeito colateral, como `import "./globals.css"` em layouts do
 *   App Router.
 *
 *   Por padrão, o Next.js já declara `*.module.css` (CSS Modules) em
 *   `node_modules/next/types/global.d.ts`, mas NÃO declara o CSS
 *   global. Quando o TypeScript Server roda em modo mais estrito
 *   (flag `noUncheckedSideEffectImports`), isso gera o erro TS2882
 *   no `import "./globals.css"`. Esta declaração resolve o problema
 *   sem afetar o build — o Next.js continua sendo quem realmente
 *   processa o arquivo via PostCSS/Tailwind.
 */
declare module "*.css";
