/**
 * Configuração do Tailwind CSS.
 *
 * As cores recebem nomes pelo papel que cumprem no sistema (marca,
 * tinta, papel, fundo) em vez do valor de cor exato. Se um dia
 * trocarmos a paleta, basta alterar este arquivo e as classes
 * espalhadas pelo código continuam apontando para o lugar certo.
 *
 * Como ler os nomes deste arquivo. Quando uma cor está escrita
 * como um valor único, por exemplo tinta, o nome vira classe
 * direto, como text-tinta. Quando uma cor é um objeto com várias
 * chaves, por exemplo marca, cada chave vira uma variante de
 * classe. A chave especial DEFAULT é o que vale quando a classe
 * aparece sem sufixo: bg-marca usa o valor de DEFAULT. As outras
 * chaves recebem sufixo, como bg-marca-forte e bg-marca-fraca.
 *
 * As variantes seguem uma convenção simples no projeto. A palavra
 * forte indica um tom mais escuro que o padrão, usado em estados
 * de ênfase como hover. A palavra fraca indica um tom mais claro,
 * usado em fundos suaves de etiquetas e cartões.
 *
 * O bloco theme.extend acrescenta esses ajustes ao tema padrão do
 * Tailwind sem apagar o que já vem pronto. As cores, cantos e
 * fontes que a biblioteca traz de fábrica continuam disponíveis
 * para a gente usar caso precise.
 */
import type { Config } from "tailwindcss";

const config: Config = {
  // Pastas onde o Tailwind procura pelas classes que o projeto
  // usa. O gerador só inclui no CSS final as classes que aparecem
  // em algum arquivo listado aqui, então precisamos cobrir tanto
  // as rotas (src/app) quanto os componentes (src/views).
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/views/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        // Cor principal do sistema, em três intensidades. A do
        // meio (DEFAULT) aparece em botões primários e em links em
        // destaque. A mais escura (forte) entra quando o usuário
        // passa o mouse por cima, dando sensação de profundidade.
        // A mais clara (fraca) é o fundo de etiquetas que carregam
        // a identidade do sistema sem chamar muita atenção.
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

        // Texto principal do sistema. É um tom quase preto,
        // escolhido para dar bastante contraste com o fundo claro
        // das telas.
        tinta: "#0f172a",

        // Texto secundário, em um cinza médio mais claro que
        // tinta. Aparece em descrições, legendas e datas que
        // precisam ficar presentes mas em segundo plano. Apesar do
        // nome lembrar tinta, esta aqui é uma cor independente,
        // não uma variante. Por isso a classe gerada é
        // text-tintaFraca, com tudo junto, e não text-tinta-fraca.
        tintaFraca: "#475569",

        // Tom claro usado em bordas, divisórias e contornos
        // discretos. Aparece como border-linha em cartões e
        // separadores entre seções.
        linha: "#e2e8f0",

        // Branco aplicado em superfícies elevadas, como cartões,
        // tabelas e janelas, que ficam por cima do plano de fundo
        // da página.
        papel: "#ffffff",

        // Cinza bem claro do plano de fundo da página. Cria um
        // contraste suave com o branco do papel, o que ajuda a
        // delimitar visualmente os cartões.
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

      // Pilha de fontes da família sans, que é a fonte padrão do
      // projeto inteiro. O navegador percorre a lista de cima para
      // baixo e usa a primeira fonte que estiver instalada no
      // sistema operacional do usuário. Não baixamos fontes da
      // internet, o que deixa o site mais leve e evita atraso ao
      // abrir uma página.
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
