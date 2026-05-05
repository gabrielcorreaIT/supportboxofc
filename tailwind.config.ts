/**
 * Configuração do Tailwind CSS.
 *
 * Reúne a paleta de cores e os caminhos onde o Tailwind procura por
 * classes. Como esta etapa entrega só a parte visual, o tema é
 * simples: poucas cores, base neutra com um azul institucional e um
 * âmbar para chamar atenção em situações específicas, como prioridade
 * alta.
 *
 * Quando o restante do sistema for adicionado, nada aqui muda. Esta
 * configuração diz respeito apenas à aparência.
 */
import type { Config } from "tailwindcss";

const config: Config = {
  // Pastas onde o Tailwind deve procurar pelas classes utilizadas.
  // Os componentes ficam em src/views e as rotas em src/app.
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/views/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Os nomes descrevem o papel da cor, não a cor em si. Assim a
      // troca de paleta no futuro não exige renomear classes.
      colors: {
        // Cor principal usada em botões e links de destaque.
        marca: {
          DEFAULT: "#1d4ed8",
          forte: "#1e3a8a",
          fraca: "#dbeafe",
        },
        // Tom usado para chamar atenção em avisos e prioridade alta.
        destaque: {
          DEFAULT: "#d97706",
          fraca: "#fef3c7",
        },
        // Tons neutros para texto e bordas.
        tinta: "#0f172a",
        tintaFraca: "#475569",
        linha: "#e2e8f0",
        // Fundos de página e de cartões.
        papel: "#ffffff",
        fundo: "#f8fafc",
      },
      // Cantos discretos. Evitamos bordas muito arredondadas para
      // manter a aparência sóbria e formal.
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      },
      // Usamos a tipografia padrão do sistema operacional. Não
      // carregamos fontes de fora.
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
