/**
 * Configuração do Tailwind CSS para o projeto.
 *
 * Reúne em um lugar só a paleta de cores que o sistema usa, os
 * ajustes de cantos arredondados e a fonte padrão. As cores recebem
 * nomes descritivos (marca, tinta, linha, papel) para que cada
 * componente trabalhe pelo papel da cor e não pelo valor exato.
 * Assim, se a paleta mudar no futuro, basta alterar este arquivo
 * sem precisar caçar tons espalhados pelo código.
 *
 * O array content informa ao Tailwind onde procurar pelas classes
 * usadas no projeto. Sem isso, o gerador de CSS final não saberia
 * quais classes incluir.
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
        // Cor principal do sistema. Aplicada em botões primários,
        // links em destaque e elementos que carregam a identidade
        // visual da marca.
        marca: {
          DEFAULT: "#1d4ed8",
          forte: "#1e3a8a",
          fraca: "#dbeafe",
        },
        // Tom usado para chamar atenção em situações pontuais, como
        // chamados em andamento ou avisos de prioridade alta.
        destaque: {
          DEFAULT: "#d97706",
          fraca: "#fef3c7",
        },
        // Tons neutros usados em texto, bordas e separadores.
        // tinta serve para o texto principal, tintaFraca para texto
        // secundário e linha para divisórias e contornos discretos.
        tinta: "#0f172a",
        tintaFraca: "#475569",
        linha: "#e2e8f0",
        // Fundos. papel é o branco usado em cartões e janelas.
        // fundo é o cinza muito claro do plano de fundo da página.
        papel: "#ffffff",
        fundo: "#f8fafc",
      },
      // Cantos discretos. Evitamos bordas muito arredondadas para
      // manter a aparência sóbria e formal do sistema.
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      },
      // Usamos a tipografia padrão do sistema operacional. O
      // navegador escolhe a primeira fonte disponível da lista.
      // Não carregamos fontes externas para deixar o site mais leve.
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
