/**
 * Dados de exemplo para alimentar as telas nesta etapa do projeto.
 *
 * Cada lista aqui simula uma resposta que mais para a frente vai
 * vir de um controlador. Os componentes não importam diretamente
 * deste arquivo. Quem importa são as páginas, que então passam os
 * dados para os componentes pelas suas props. Quando os
 * controladores existirem, basta apagar este arquivo e trocar a
 * origem das listas, sem mudar nada na parte visual.
 */
import type {
  ChamadoDetalhado,
  ChamadoResumo,
  UsuarioVisivel,
} from "./tipos-view";

/**
 * Usuário entrado como solicitante. Usado no cabeçalho do portal
 * e para filtrar os chamados abertos por essa pessoa.
 */
export const usuarioSolicitanteExemplo: UsuarioVisivel = {
  nome: "Joana Pereira",
};

/**
 * Usuário entrado como agente. Usado na barra lateral do painel
 * de TI.
 */
export const usuarioAgenteExemplo: UsuarioVisivel = {
  nome: "Marcos Silva",
};

/**
 * Lista usada no painel do agente. Foi montada com chamados de
 * solicitantes diferentes, várias categorias, prioridades e
 * situações para conseguir mostrar a tela em todos os estados
 * possíveis durante a apresentação.
 */
export const chamadosExemploAgente: ChamadoResumo[] = [
  {
    id: "1",
    protocolo: "CH-2025-001",
    titulo: "Impressora do RH não imprime",
    solicitante: "Joana Pereira",
    categoria: "Hardware",
    prioridade: "Média",
    status: "Em Andamento",
    atribuidoA: "Marcos Silva",
    criadoEmFormatado: "22/03/2026 09:12",
  },
  {
    id: "2",
    protocolo: "CH-2025-002",
    titulo: "Solicitação de acesso ao SAP",
    solicitante: "Carlos Mendes",
    categoria: "Acesso",
    prioridade: "Baixa",
    status: "Aberto",
    criadoEmFormatado: "22/03/2026 14:05",
  },
  {
    id: "3",
    protocolo: "CH-2025-003",
    titulo: "Sistema de folha travando",
    solicitante: "Lúcia Andrade",
    categoria: "Software",
    prioridade: "Alta",
    status: "Aberto",
    criadoEmFormatado: "23/03/2026 08:40",
  },
  {
    id: "4",
    protocolo: "CH-2025-004",
    titulo: "Reset de senha do e-mail",
    solicitante: "Joana Pereira",
    categoria: "Acesso",
    prioridade: "Baixa",
    status: "Concluído",
    atribuidoA: "Marcos Silva",
    criadoEmFormatado: "20/03/2026 11:20",
  },
  {
    id: "5",
    protocolo: "CH-2025-005",
    titulo: "Wi-Fi caindo no 3º andar",
    solicitante: "Equipe Comercial",
    categoria: "Rede",
    prioridade: "Alta",
    status: "Em Andamento",
    atribuidoA: "Marcos Silva",
    criadoEmFormatado: "23/03/2026 10:05",
  },
];

/**
 * Lista usada no portal do solicitante. Mostra apenas os chamados
 * abertos pelo usuário de exemplo, derivada da lista do agente
 * para evitar duplicar dados.
 */
export const chamadosExemploSolicitante: ChamadoResumo[] = chamadosExemploAgente.filter(
  (c) => c.solicitante === usuarioSolicitanteExemplo.nome,
);

/**
 * Tabela que liga o id de um chamado à sua versão completa, com
 * descrição e histórico. A janela de detalhes consulta este mapa
 * quando precisa carregar um chamado específico para exibir.
 */
export const detalhesExemploPorId: Record<string, ChamadoDetalhado> = {
  "1": {
    ...chamadosExemploAgente[0],
    descricao:
      "Tentei imprimir um relatório no setor de RH e a impressora não responde. " +
      "A luz vermelha está piscando e o painel mostra 'erro 0x80'.",
    comentarios: [
      {
        id: "c1",
        autor: "Sistema",
        texto: "Chamado registrado e encaminhado à equipe de TI.",
        criadoEm: "22/03 09:12",
      },
      {
        id: "c2",
        autor: "Marcos Silva",
        texto:
          "Bom dia, Joana. Já estou olhando a impressora. Pode me confirmar se a luz vermelha está acesa?",
        criadoEm: "22/03 10:30",
      },
    ],
  },
  "2": {
    ...chamadosExemploAgente[1],
    descricao:
      "Preciso de acesso aos módulos de Compras e Estoque do SAP para conseguir " +
      "lançar as notas fiscais do trimestre.",
    comentarios: [
      {
        id: "c3",
        autor: "Sistema",
        texto: "Chamado registrado.",
        criadoEm: "22/03 14:05",
      },
    ],
  },
  "3": {
    ...chamadosExemploAgente[2],
    descricao:
      "Ao abrir a tela de fechamento de folha, o sistema fica branco por alguns " +
      "segundos e depois exibe 'sem resposta'. Já reiniciei a máquina.",
    comentarios: [],
  },
  "4": {
    ...chamadosExemploAgente[3],
    descricao: "Esqueci minha senha do e-mail corporativo após o feriado.",
    comentarios: [
      {
        id: "c4",
        autor: "Sistema",
        texto: "Senha resetada com sucesso. Chamado encerrado.",
        criadoEm: "20/03 13:00",
      },
    ],
  },
  "5": {
    ...chamadosExemploAgente[4],
    descricao:
      "O Wi-Fi do 3º andar cai a cada 10 minutos, atrapalhando reuniões " +
      "remotas. Já testamos com vários dispositivos.",
    comentarios: [],
  },
};
