/**
 * CAMADA: Configuração / Build (Tailwind CSS)
 * ARQUIVO: tailwind.config.ts
 *
 * RESPONSABILIDADE
 *   Centraliza a paleta de cores e os caminhos onde o Tailwind
 *   deve procurar classes. Como esta etapa do projeto entrega
 *   apenas a camada de View, mantemos o tema simples e direto:
 *   poucos tokens semânticos, paleta neutra com um único acento
 *   (azul institucional) e um destaque (âmbar) para chamar
 *   atenção a estados específicos (ex.: prioridade alta).
 *
 * ENCAIXE NO MVC FUTURO
 *   Esta configuração é puramente visual. Não muda quando os
 *   Controllers ou Models forem adicionados — Views consomem
 *   estas classes; Controllers/Models não enxergam Tailwind.
 */
import type { Config } from "tailwindcss";

const config: Config = {
  // Caminhos analisados em busca de classes Tailwind. A View vive
  // em src/app (rotas) e src/views (componentes).
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/views/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Paleta semântica — nomes de papel, não de cor.
      // Permite trocar a cor depois sem renomear classes.
      colors: {
        // Acento institucional (botões primários, links).
        marca: {
          DEFAULT: "#1d4ed8", // blue-700
          forte: "#1e3a8a",   // blue-900 (hover/ênfase)
          fraca: "#dbeafe",   // blue-100 (fundos suaves)
        },
        // Destaque pontual (avisos, prioridade alta).
        destaque: {
          DEFAULT: "#d97706", // amber-600
          fraca: "#fef3c7",   // amber-100
        },
        // Texto e bordas neutros.
        tinta: "#0f172a",      // slate-900
        tintaFraca: "#475569", // slate-600
        linha: "#e2e8f0",      // slate-200
        // Fundos de página e cartões.
        papel: "#ffffff",
        fundo: "#f8fafc",      // slate-50
      },
      // Cantos discretos. O projeto evita cantos muito redondos
      // para reforçar a estética sóbria/acadêmica.
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      },
      // Tipografia: a fonte do sistema é suficiente para o estilo
      // "trabalho universitário" — sem importar fontes externas.
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
