/**
 * CAMADA: View (dados de demonstração)
 * ARQUIVO: src/views/compartilhado/dados-mock.ts
 *
 * RESPONSABILIDADE
 *   Fornecer dados *fake* para que as Views possam ser visualizadas
 *   sem nenhum Controller ou Model em funcionamento. Cada lista aqui
 *   simula uma resposta que, na versão final, virá de um Controller.
 *
 * ENCAIXE NO MVC FUTURO
 *   Os componentes desta etapa importam estes mocks via PROPS — nunca
 *   diretamente de dentro de si mesmos. Quando os Controllers chegarem,
 *   este arquivo é simplesmente removido: as páginas passarão a chamar
 *   `acaoListarChamados()` em vez de importar `chamadosFake`. Nenhuma
 *   View precisará mudar.
 *
 *   Em outras palavras: as Views dependem de uma INTERFACE de dados
 *   (vide tipos-view.ts), não da origem deles. É o princípio DIP do SOLID.
 */
import type {
  ChamadoDetalhado,
  ChamadoResumo,
  ComentarioVisivel,
  UsuarioVisivel,
} from "./tipos-view";

// ---------------------------------------------------------------------------
// Usuários de demonstração
// ---------------------------------------------------------------------------

/** Usuário "logado" como solicitante (visualização do portal). */
export const usuarioSolicitanteFake: UsuarioVisivel = {
  nome: "Joana Pereira",
  papel: "solicitante",
};

/** Usuário "logado" como agente (visualização do painel de TI). */
export const usuarioAgenteFake: UsuarioVisivel = {
  nome: "Marcos Silva",
  papel: "agente",
};

// ---------------------------------------------------------------------------
// Comentários de demonstração — usados dentro do modal de detalhes
// ---------------------------------------------------------------------------

const comentariosChamadoUm: ComentarioVisivel[] = [
  {
    id: "c1",
    autor: "Sistema",
    texto: "Chamado registrado e encaminhado à equipe de TI.",
    criadoEm: "22/03 09:12",
  },
  {
    id: "c2",
    autor: "Marcos Silva",
    texto: "Bom dia, Joana. Já estou olhando a impressora. Pode me confirmar se a luz vermelha está acesa?",
    criadoEm: "22/03 10:30",
  },
];

const comentariosChamadoDois: ComentarioVisivel[] = [
  {
    id: "c3",
    autor: "Sistema",
    texto: "Chamado registrado.",
    criadoEm: "22/03 14:05",
  },
];

// ---------------------------------------------------------------------------
// Lista de chamados (resumo) — alimenta as listas/tabelas
// ---------------------------------------------------------------------------

/**
 * Lista usada pelo painel do AGENTE — vê chamados de todos.
 * Mistura solicitantes, prioridades, status e categorias para
 * mostrar a UI em vários estados.
 */
export const chamadosFakeAgente: ChamadoResumo[] = [
  {
    id: "1",
    protocolo: "CH-2025-001",
    titulo: "Impressora do RH não imprime",
    solicitante: "Joana Pereira",
    categoria: "Hardware",
    prioridade: "Média",
    status: "Em Andamento",
    tipo: "incidente",
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
    tipo: "solicitacao",
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
    tipo: "incidente",
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
    tipo: "solicitacao",
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
    tipo: "incidente",
    atribuidoA: "Marcos Silva",
    criadoEmFormatado: "23/03/2026 10:05",
  },
];

/**
 * Lista usada pelo painel do SOLICITANTE — apenas os chamados dele.
 * Filtra a lista geral pelo nome do solicitante de demonstração.
 */
export const chamadosFakeSolicitante: ChamadoResumo[] = chamadosFakeAgente.filter(
  (c) => c.solicitante === usuarioSolicitanteFake.nome,
);

// ---------------------------------------------------------------------------
// Detalhes — usados quando o usuário abre o modal de um chamado
// ---------------------------------------------------------------------------

/**
 * Tabela "id do chamado" -> versão detalhada (com descrição e
 * histórico). O modal consulta este mapa por id.
 */
export const detalhesFakePorId: Record<string, ChamadoDetalhado> = {
  "1": {
    ...chamadosFakeAgente[0],
    descricao:
      "Tentei imprimir um relatório no setor de RH e a impressora não responde. " +
      "A luz vermelha está piscando e o painel mostra 'erro 0x80'.",
    comentarios: comentariosChamadoUm,
  },
  "2": {
    ...chamadosFakeAgente[1],
    descricao:
      "Preciso de acesso aos módulos de Compras e Estoque do SAP para conseguir " +
      "lançar as notas fiscais do trimestre.",
    comentarios: comentariosChamadoDois,
  },
  "3": {
    ...chamadosFakeAgente[2],
    descricao:
      "Ao abrir a tela de fechamento de folha, o sistema fica branco por alguns " +
      "segundos e depois exibe 'sem resposta'. Já reiniciei a máquina.",
    comentarios: [],
  },
  "4": {
    ...chamadosFakeAgente[3],
    descricao:
      "Esqueci minha senha do e-mail corporativo após o feriado.",
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
    ...chamadosFakeAgente[4],
    descricao:
      "O Wi-Fi do 3º andar cai a cada 10 minutos, atrapalhando reuniões " +
      "remotas. Já testamos com vários dispositivos.",
    comentarios: [],
  },
};
