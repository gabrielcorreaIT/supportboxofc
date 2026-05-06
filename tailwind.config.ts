/**
 * Configuração do Tailwind CSS.
 *
 * Cada bloco abaixo define uma parte do tema do projeto. As cores
 * recebem nomes pelo papel que cumprem (marca, tinta, papel) e não
 * pelo valor de cor exato. Assim, se a paleta for trocada um dia,
 * basta alterar este arquivo e as classes espalhadas pelo código
 * continuam apontando para o lugar certo, agora com a cor nova.
 *
 * O bloco theme.extend adiciona itens ao tema padrão do Tailwind
 * sem apagar o que já vem pronto, então as cores, cantos e fontes
 * padrão da biblioteca continuam disponíveis caso a gente precise.
 */
import type { Config } from "tailwindcss";

const config: Config = {
  // Pastas onde o Tailwind procura pelas classes usadas no projeto.
  // O gerador só inclui no CSS final as classes que aparecem em
  // algum arquivo listado aqui. Por isso precisamos cobrir tanto
  // as rotas (src/app) quanto os componentes (src/views).
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/views/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        // Cor principal do sistema. Aplicada em botões primários,
        // links em destaque e elementos que carregam a identidade
        // visual. A variante forte é usada em estados de hover e
        // a fraca em fundos claros de etiquetas. As classes geradas
        // são bg-marca, bg-marca-forte e bg-marca-fraca, e o mesmo
        // vale para text e border.
        marca: {
          DEFAULT: "#1d4ed8",
          forte: "#1e3a8a",
          fraca: "#dbeafe",
        },

        // Tom usado para chamar atenção em situações pontuais, como
        // chamados em andamento ou avisos de prioridade alta. A
        // variante fraca serve para os fundos claros das etiquetas
        // dessas situações.
        destaque: {
          DEFAULT: "#d97706",
          fraca: "#fef3c7",
        },

        // Tons neutros que cuidam do texto e das divisórias do
        // sistema. tinta é a cor padrão dos títulos e do texto
        // principal. tintaFraca é o cinza dos textos secundários
        // e descrições. linha é o tom claro das bordas e dos
        // separadores entre seções.
        tinta: "#0f172a",
        tintaFraca: "#475569",
        linha: "#e2e8f0",

        // Cores de fundo. papel é o branco aplicado em cartões,
        // tabelas e janelas. fundo é o cinza bem claro do plano de
        // fundo da página, que cria contraste com o papel e ajuda
        // a delimitar visualmente as áreas da tela.
        papel: "#ffffff",
        fundo: "#f8fafc",
      },

      // Tamanhos de canto arredondado. Mantemos cantos discretos
      // para reforçar a aparência sóbria do sistema. Os nomes sm,
      // md e lg viram as classes rounded-sm, rounded-md e
      // rounded-lg. O valor de DEFAULT é o que vale ao usar a
      // classe rounded sozinha, sem sufixo.
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      },

      // Pilha de fontes para o conjunto sans (a fonte padrão de
      // todo o projeto). O navegador percorre a lista de cima para
      // baixo e usa a primeira fonte que estiver instalada no
      // sistema operacional do usuário. Não baixamos fontes da
      // internet, o que deixa o site mais leve e evita tempo de
      // espera ao abrir uma página.
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

  // Lista de plugins do Tailwind. Por enquanto não usamos nenhum.
  plugins: [],
};

export default config;
