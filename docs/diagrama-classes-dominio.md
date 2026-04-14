# Diagrama de Classes de Dominio -- SupportBox

> Arquivo gerado a partir da analise completa do codigo-fonte do projeto.
> Cole o bloco Mermaid abaixo em qualquer visualizador compativel
> (mermaid.live, GitHub, Notion, VS Code com extensao Mermaid).
> O arquivo `.mmd` puro esta em `docs/diagrama-classes-dominio.mmd`.

---

## Resumo da Arquitetura MVC

```
+------------------------------------------------------------------+
|                     VIEWS (Client Components)                     |
|  FormularioLogin  PainelSolicitante  ListaChamados  AgenteIA      |
|        |              |               |          |                |
|        v              v               v          v                |
+------------------------------------------------------------------+
|                  CONTROLLERS (Server Actions)                     |
|             AuthController       ChamadoController                |
|                  |                  |          |                  |
|                  v                  v          v                  |
+------------------------------------------------------------------+
|                       MODELS (Data Layer)                         |
|             ChamadoModel                 IAModel                  |
|                  |                          |                     |
|                  v                          v                     |
+------------------------------------------------------------------+
|                   INFRAESTRUTURA EXTERNA                          |
|          Supabase (PostgreSQL)      Google Gemini API             |
+------------------------------------------------------------------+
```

---

## Notas sobre Mapeamento DB

Os campos das interfaces `Chamado` e `Comentario` estao em portugues
(ex: `numero_protocolo`, `solicitante`, `titulo`). O `ChamadoModel` contem
funcoes de mapeamento (`mapearChamadoDoBanco` / `mapearChamadoParaBanco`)
que convertem entre os nomes das colunas do banco (ingles) e os campos
do dominio (portugues). Os valores armazenados no banco (ex: `"incident"`,
`"service_request"`) permanecem inalterados.

| Campo no dominio | Coluna no banco |
|-------------------|-----------------|
| `numero_protocolo` | `ticket_number` |
| `solicitante` | `requester` |
| `atribuido_a` | `assigned_to` |
| `titulo` | `title` |
| `descricao` | `description` |
| `prioridade` | `priority` |
| `categoria` | `category` |
| `tipo` | `type` |
| `criado_em` | `created_at` |
| `atualizado_em` | `updated_at` |
| `chamado_id` | `ticket_id` |
| `autor` | `author` |
| `texto` | `text` |

---

## Descricao das Classes

### Dominio (src/models/types.ts)

| Classe | Descricao |
|--------|-----------|
| **Chamado** | Entidade central. Chamado com protocolo (CH-XXXXXXXX), solicitante, tecnico, status, prioridade e categoria. Campos opcionais: `atribuido_a`, `atualizado_em`. Tipo: `incident` ou `service_request`. |
| **Comentario** | Interacao vinculada a um Chamado via `chamado_id`. Relacao **N:1** -- um chamado possui muitos comentarios. Campos opcionais: `id`, `criado_em`. |
| **StatusChamado** | Ciclo de vida: Aberto -> Em Andamento -> Concluido. |
| **PrioridadeChamado** | Niveis: Baixa, Media, Alta, Urgente. Deteccao automatica por palavras-chave no Controller. |
| **CategoriaChamado** | Classificacao: Hardware, Software, Acesso, Rede. |

### Models

| Classe | Arquivo | Responsabilidade |
|--------|---------|------------------|
| **ChamadoModel** | src/models/TicketModel.ts | CRUD de chamados e comentarios no Supabase. Mapeamento entre colunas do banco (ingles) e dominio (portugues). |
| **IAModel** | src/models/IAModel.ts | Comunicacao com Gemini 2.5 Flash. Triagem Level 0 (`analisarDeflexao`) e interpretacao de comandos Telegram (`processarComandoTelegram`). |

### Controllers (Server Actions)

| Classe | Arquivo | Responsabilidade | Depende de |
|--------|---------|------------------|------------|
| **AuthController** | src/controllers/AuthController.ts | Login com JWT em cookies HttpOnly (`acaoLogin`), leitura de sessao (`acaoObterUsuarioAtual`), logout (`acaoLogout`). | SupabaseClient |
| **ChamadoController** | src/controllers/TicketController.ts | Toda a logica de negocio: validacao, criacao de chamados com deteccao de urgencia, triagem IA, dashboard com metricas, atribuicao e resolucao. | ChamadoModel, IAModel |

### Views (Client Components)

| Componente | Arquivo | Papel | Consome |
|------------|---------|-------|---------|
| **FormularioLogin** | src/views/auth/LoginForm.tsx | Formulario de autenticacao | acaoLogin |
| **PainelSolicitante** | src/views/ticket/SolicitanteDashboard.tsx | Dashboard do solicitante. Compoe FormularioChamado, ModalAgenteChamado (apenasLeitura) e AgenteIA. | AuthController, ChamadoController |
| **FormularioChamado** | src/views/ticket/TicketForm.tsx | Formulario em 4 etapas com triagem IA antes da abertura. Props: nomeSolicitante. | acaoAnalisarProblema, acaoCriarChamado |
| **ListaChamados** | src/views/ticket/ticket-list.tsx | Dashboard do agente com busca, filtros por status e listagem. | acaoObterDadosPainel |
| **ModalAgenteChamado** | src/views/ticket/ticket-agent-modal.tsx | Modal de detalhes com acoes: assumir, resolver, comentar. Props: protocoloChamado, aberto, aoFechar, nomeUsuario, apenasLeitura. | ChamadoController (4 acoes) |
| **AgenteIA** | src/views/ticket/AIAgent.tsx | Chatbot flutuante de triagem Level 0. | acaoAnalisarProblema |
| **BarraLateralAgente** | src/views/ticket/AgentSidebar.tsx | Sidebar de navegacao do painel do agente. | AuthController |

### Integracoes

| Classe | Arquivo | Descricao |
|--------|---------|-----------|
| **WebhookTelegram** | src/app/api/telegram/route.ts | API Route POST que recebe texto/voz do Telegram, interpreta via IAModel e executa acoes via ChamadoController. |
| **Middleware** | src/middleware.ts | Protege rotas /agente/* e /solicitante/* validando expiracao do JWT nos cookies. |
| **UtilidadesChamado** | src/lib/ticket-utils.ts | Funcoes puras: obterCorStatus, obterCorPrioridade, obterInsigniaPrioridade, formatarData. |

---

## Legenda de Relacionamentos

| Simbolo | Significado | Exemplo |
|---------|-------------|---------|
| `-->` (seta solida) | **Dependencia direta** -- a classe usa/importa a outra | `ChamadoController --> ChamadoModel` |
| `..>` (seta pontilhada) | **Dependencia de tipo** -- usa a interface/tipo como parametro ou retorno | `ChamadoModel ..> Chamado` |
| `*--` (losango preenchido) | **Composicao** -- a classe pai contem e gerencia o ciclo de vida da filha | `PainelSolicitante *-- FormularioChamado` |
| `"N" --> "1"` | **Multiplicidade** -- indica a cardinalidade do relacionamento | `Comentario "N" --> "1" Chamado` |
