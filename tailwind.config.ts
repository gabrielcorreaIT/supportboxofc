/**
 * Configuração do Tailwind CSS. Reúne a paleta de cores e os
 * caminhos onde o Tailwind procura por classes.
 */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/views/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marca: {
          DEFAULT: "#1d4ed8",
          forte: "#1e3a8a",
          fraca: "#dbeafe",
        },
        destaque: {
          DEFAULT: "#d97706",
          fraca: "#fef3c7",
        },
        tinta: "#0f172a",
        tintaFraca: "#475569",
        linha: "#e2e8f0",
        papel: "#ffffff",
        fundo: "#f8fafc",
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      },
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
