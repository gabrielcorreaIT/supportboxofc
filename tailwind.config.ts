/**
 * Configuração do Tailwind CSS para o projeto.
 *
 * Reúne em um lugar só a paleta de cores que o sistema usa, os
 * ajustes de cantos arredondados e a fonte padrão.
 *
 * O array content informa ao Tailwind onde procurar pelas classes
 * usadas no projeto. Sem isso, o gerador de CSS final não saberia
 * quais classes incluir.
 *
 * Como ler os nomes deste arquivo. Quando uma cor está escrita
 * como um valor único (por exemplo tinta), o nome vira classe
 * direto, como text-tinta. Quando uma cor é um objeto com várias
 * chaves (por exemplo marca), cada chave vira uma variante. A
 * chave especial DEFAULT é o que vale quando a classe aparece sem
 * sufixo: bg-marca usa o valor de DEFAULT. As outras chaves
 * recebem sufixo, como bg-marca-forte e bg-marca-fraca.
 *
 * As variantes seguem uma convenção simples no projeto: forte é
 * um tom mais escuro que o padrão, usado em estados de ênfase
 * como hover. fraca é um tom mais claro, usado em fundos suaves
 * de etiquetas e cartões.
 */
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/views/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cor principal do sistema, em três intensidades. A do
        // meio (DEFAULT) aparece em botões primários e em links em
        // destaque. A mais escura (forte) entra em estados de
        // hover, dando sensação de profundidade. A mais clara
        // (fraca) é o fundo de etiquetas que carregam a identidade
        // do sistema sem chamar muita atenção.
        marca: {
          DEFAULT: "#1d4ed8",
          forte: "#1e3a8a",
          fraca: "#dbeafe",
        },
        // Tom de aviso, em duas intensidades. O mais escuro
        // (DEFAULT) é usado em textos e ícones de chamados em
        // andamento. O mais claro (fraca) é o fundo das etiquetas
        // dessas mesmas situações.
        destaque: {
          DEFAULT: "#d97706",
          fraca: "#fef3c7",
        },
        // Tons neutros usados em texto e em divisórias do sistema.
        // tinta é o quase preto do texto principal. tintaFraca é
        // o cinza médio dos textos secundários, descrições e datas.
        // Apesar do nome lembrar uma variante, tintaFraca é uma
        // cor independente, com classe text-tintaFraca em uma
        // palavra só. linha é o tom claro das bordas e dos
        // separadores entre seções.
        tinta: "#0f172a",
        tintaFraca: "#475569",
        linha: "#e2e8f0",

        // papel é o branco usado em superfícies elevadas, como
        // cartões, tabelas e janelas.
        // fundo é o cinza bem claro do plano de fundo da página,
        // que cria contraste suave com o papel e ajuda a delimitar
        // visualmente os cartões.
        papel: "#ffffff",
        fundo: "#f8fafc",
      },
      // Tamanhos de canto arredondado, em quatro intensidades. Os
      // nomes sm, md e lg viram as classes rounded-sm, rounded-md
      // e rounded-lg. O DEFAULT é o que vale ao usar a classe
      // rounded sozinha, sem sufixo. Mantemos cantos discretos
      // para reforçar a aparência sóbria do sistema.
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      },
      // Usamos a tipografia padrão do sistema operacional. O
      // navegador percorre a lista de cima para baixo e usa a
      // primeira fonte que estiver instalada. Não carregamos
      // fontes externas para deixar o site mais leve.
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
