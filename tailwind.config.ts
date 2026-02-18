import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    // 🎯 O ajuste principal está aqui:
    // Agora o Tailwind olha para tudo dentro de "src" (app, components, lib, features)
    "./src/**/*.{ts,tsx,js,jsx,mdx}",

    // (Opcional) Mantemos estes comentados por segurança caso você ainda tenha algo na raiz durante a migração.
    // Depois pode apagar:
    // "./app/**/*.{ts,tsx}",
    // "./components/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        supportbox: {
          DEFAULT: "#d4924b",
          dark: "#c27f33",
          light: "#e6a968",
          foreground: "#ffffff",
        },
        primary: {
          DEFAULT: "#d4924b",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#222222",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#f0d0b0",
          foreground: "#222222",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
