/**
 * Configuração do Tailwind CSS.
 *
 * Define a paleta de cores, bordas e fonte do sistema.
 *
 * ──────────────────────────────────────────────────────────────
 * COMO AS CORES VIRAM CLASSES
 * ──────────────────────────────────────────────────────────────
 * • Valor único         → classe direta:    `tinta`     → `text-tinta`
 * • Objeto com chaves   → vira variantes:   `marca.forte` → `bg-marca-forte`
 * • Chave `DEFAULT`     → classe sem sufixo: `marca.DEFAULT` → `bg-marca`
 *
 * Convenção das variantes:
 *   forte  → tom mais escuro (ênfase, profundidade)
 *   fraca  → tom mais claro  (fundos suaves de etiquetas/cartões)
 *
 * ──────────────────────────────────────────────────────────────
 * PALETA — onde cada cor é usada
 * ──────────────────────────────────────────────────────────────
 *   marca:         botões primários, links em destaque
 *   marca-forte:   áreas com profundidade extra
 *   marca-fraca:   fundo de etiquetas da identidade
 *
 *   destaque:      texto/ícone de chamados em andamento
 *   destaque-fraca: fundo das etiquetas desses chamados
 *
 *   tinta:         texto principal (quase preto)
 *   tintaFraca:    texto secundário, descrições, datas
 *   linha:         bordas e separadores
 *
 *   papel:         superfícies elevadas (cartões, tabelas, modais)
 *   fundo:         plano de fundo da página
 *
 * Alterar um valor abaixo afeta TODAS as classes que usam Tailwind. >>>>>>>>>MUITO CUIDADO AQUI PELO AMOR DE DEUS.<<<<<<<<<<<<<<<<<
 */
import type { Config } from "tailwindcss";

const config: Config = {
  // Onde o Tailwind procura classes em uso. Sem isso, o CSS final fica vazio.
  content: ["./src/app/**/*.{ts,tsx}", "./src/views/**/*.{ts,tsx}"],

  theme: {
    extend: {
      colors: {
        marca: { DEFAULT: "#FF9000", forte: "#FF7000", fraca: "#FFEDD5" },
        destaque: { DEFAULT: "#d97706", fraca: "#fef3c7" },

        tinta: "#0f172a",
        tintaFraca: "#475569",
        linha: "#e2e8f0",

        papel: "#ffffff",
        fundo: "#f8fafc",
      },

      // `rounded` (sem sufixo) usa DEFAULT. Demais viram `rounded-sm|md|lg`.
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      },

      // Fonte do SO — sem download externo. Usa a primeira disponível.
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },

  plugins: [],
};

export default config;
