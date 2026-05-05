# SupportBox

Sistema interno de Help Desk — versão acadêmica/MVP.

> **Estado atual: Etapa 1 do MVC — apenas a camada de _View_.**
> Os _Controllers_ (regras de uso) e _Models_ (acesso a dados) serão
> adicionados nas etapas seguintes, sem alterar o que já está pronto
> nesta camada.

---

## 1. Visão Geral

O SupportBox é um sistema simples de abertura e atendimento de
chamados, dividido em dois perfis:

| Perfil          | Pode                                                            |
| --------------- | --------------------------------------------------------------- |
| **Solicitante** | Abrir chamados, ver os próprios chamados, comentar.             |
| **Agente**      | Ver todos os chamados, filtrar, assumir, concluir e comentar.   |

Esta primeira entrega traz **apenas a interface gráfica** funcionando
com dados de demonstração. Não há banco, autenticação real ou regra
de negócio — tudo é alimentado por mocks em `src/views/compartilhado/dados-mock.ts`.

---

## 2. Como Rodar

```bash
# Instalar dependências
npm install

# Subir em modo desenvolvimento (http://localhost:3000)
npm run dev

# Gerar build de produção
npm run build && npm start
```

Pré-requisitos: **Node.js 18+** e **npm 9+**.

### Roteiro de demonstração

1. Acesse `http://localhost:3000` — você é redirecionado para `/login`.
2. Use **qualquer e-mail e senha**:
   - E-mail contendo `agente` (ex.: `marcos.agente@empresa.com`) → painel do agente.
   - Qualquer outro (ex.: `joana@empresa.com`) → portal do solicitante.
3. Use o botão **Sair** para voltar ao login.

> O login é simulado: nenhum dado é validado de fato. Quando o
> `AuthController` existir, o redirecionamento será trocado por uma
> chamada real, **sem alterar a tela de login**.

---

## 3. Arquitetura — MVC em camadas

O projeto segue uma separação rígida entre _View_, _Controller_ e
_Model_. A regra é simples:

```
View         ↑ recebe dados e callbacks via props
             ↓ não importa de quem vêm — só renderiza
─────────────────────────────────────────────────────
Controller   ↑ orquestra ações (acaoLogin, acaoCriarChamado, …)
             ↓ chama Models, devolve dados prontos para a View
─────────────────────────────────────────────────────
Model        ↑ acesso a dados (banco, API, arquivos)
             ↓ desconhece a tela
```

Nesta etapa **só a View existe**. Os pontos onde os Controllers
"plugarão" depois estão marcados nos comentários de cada arquivo
(`ENCAIXE NO MVC FUTURO`).

### Princípios SOLID aplicados

Cada componente cita explicitamente, no seu cabeçalho, quais
princípios do SOLID está aplicando. Em resumo:

- **SRP** — cada View faz uma única coisa (ex.: `Botao` só desenha um
  botão; `FormularioLogin` só coleta credenciais).
- **OCP** — variantes/configurações são tabelas no topo do arquivo
  (ex.: `variantes` em `Botao.tsx`); novas opções entram sem mexer na
  lógica.
- **DIP** — Views recebem dados e ações como props. Hoje os callbacks
  são de demonstração; amanhã passam a ser do Controller, **sem mudar
  a View**.
- **ISP** — interfaces de props pequenas e específicas.

---

## 4. Estrutura de pastas

```
.
├── README.md                ← este arquivo
├── next.config.mjs          ← configuração do Next.js
├── postcss.config.mjs       ← PostCSS (alimenta o Tailwind)
├── tailwind.config.ts       ← paleta semântica (marca, tinta, …)
├── tsconfig.json            ← compilador TypeScript
├── package.json             ← dependências e scripts
└── src/
    ├── app/                 ← rotas (Next.js App Router)
    │   ├── layout.tsx           ← layout raiz (<html>/<body>)
    │   ├── page.tsx             ← "/" → redireciona para /login
    │   ├── globals.css          ← estilos globais (Tailwind base)
    │   ├── login/page.tsx       ← /login
    │   ├── solicitante/
    │   │   ├── layout.tsx       ← envoltório das telas do solicitante
    │   │   └── page.tsx         ← /solicitante
    │   └── agente/
    │       ├── layout.tsx       ← barra lateral fixa
    │       └── page.tsx         ← /agente
    │
    └── views/               ← componentes de UI (a "Camada View")
        ├── compartilhado/       ← reusáveis em todo o sistema
        │   ├── tipos-view.ts          ← tipos de domínio (visuais)
        │   ├── dados-mock.ts          ← dados fake desta etapa
        │   ├── Botao.tsx              ← botão com variantes
        │   ├── Cabecalho.tsx          ← header do solicitante
        │   ├── CampoTexto.tsx         ← input de uma linha
        │   ├── CampoTextoArea.tsx     ← textarea
        │   ├── CampoSelect.tsx        ← <select> padronizado
        │   ├── Etiqueta.tsx           ← "pílula" colorida (status, …)
        │   └── ModalDetalhesChamado.tsx ← modal usado pelos dois perfis
        │
        ├── auth/
        │   └── FormularioLogin.tsx    ← coleta e-mail/senha
        │
        ├── solicitante/
        │   ├── PainelSolicitante.tsx     ← orquestra a tela
        │   ├── FormularioAberturaChamado.tsx
        │   └── ListaMeusChamados.tsx
        │
        └── agente/
            ├── MenuLateralAgente.tsx     ← barra lateral
            ├── PainelAgente.tsx          ← orquestra a tela
            ├── BarraFiltros.tsx          ← busca + abas de status
            └── TabelaChamados.tsx        ← lista em tabela
```

### Por que duas pastas (`src/app` e `src/views`)?

- **`src/app`** existe por imposição do Next.js — é onde ficam as
  rotas. Os arquivos aqui são "cascas" mínimas: importam um
  componente de `src/views`, injetam props e ponto.
- **`src/views`** é onde a UI de fato vive. É lá que o
  desenvolvimento acontece, e é a parte que pode ser reaproveitada
  ou trocada de framework no futuro.

---

## 5. Fluxo dos dados (hoje × amanhã)

### Hoje — apenas View

```
┌─────────────────┐   props   ┌──────────────┐
│ src/app/.../page│──────────▶│ src/views/...│
│ (lê do mock)    │           │ (renderiza)  │
└─────────────────┘           └──────────────┘
```

A página importa diretamente de `dados-mock.ts` e passa as listas e
callbacks (no-op com `console.info`) para os componentes.

### Amanhã — com Controllers

```
┌─────────────────┐   chama    ┌────────────┐    chama    ┌────────┐
│ src/app/.../page│───────────▶│ Controller │────────────▶│ Model  │
│                 │   props    │ (regras)   │             │ (banco)│
└─────────────────┘◀────data───└────────────┘             └────────┘
        │ props
        ▼
┌──────────────┐
│ src/views/...│  (não muda)
└──────────────┘
```

Os componentes de `src/views/...` **permanecem idênticos** — apenas
quem fornece as props muda. É o princípio DIP em prática.

---

## 6. Convenções

- **Idioma**: tudo em português — nomes de arquivo, props, variáveis,
  comentários. Visa o leitor brasileiro do trabalho acadêmico.
- **Cabeçalho de arquivo**: cada arquivo começa com um bloco
  `/** CAMADA / ARQUIVO / RESPONSABILIDADE / ENCAIXE NO MVC FUTURO /
  PRINCÍPIOS SOLID APLICADOS */`. Mantenha esse padrão ao criar
  arquivos novos.
- **Estilo visual**: Tailwind com paleta semântica
  (`marca`, `tinta`, `linha`, …) definida em `tailwind.config.ts`.
  Evite hex codes inline; use os tokens.
- **Estado**: o estado dos componentes é **puramente visual** (ex.:
  qual modal está aberto, qual aba selecionada). Toda regra que
  mexe nos dados é responsabilidade do futuro Controller.
- **Acessibilidade básica**: todo input tem `<label htmlFor>`, o
  modal tem `role="dialog"` + `aria-modal`, e o foco fica visível
  via `*:focus-visible` em `globals.css`.

---

## 7. Roadmap

- [x] **Etapa 1 — View**: telas, componentes reutilizáveis, mocks.
- [ ] **Etapa 2 — Controllers**: `acaoLogin`, `acaoCriarChamado`,
      `acaoListarChamados`, `acaoAssumirChamado`, `acaoConcluirChamado`,
      `acaoComentarChamado`.
- [ ] **Etapa 3 — Models**: persistência (Supabase/Postgres) e
      autenticação real.
- [ ] **Etapa 4 — IA**: triagem automática de chamados na abertura
      (categorização, prioridade sugerida).

---

## 8. Stack técnica

| Ferramenta       | Para quê                                            |
| ---------------- | --------------------------------------------------- |
| **Next.js 15**   | Framework React com App Router e SSR.               |
| **React 19**     | Biblioteca de UI.                                   |
| **TypeScript**   | Tipagem estática — pega erros antes de rodar.       |
| **Tailwind CSS** | Estilização utilitária com paleta semântica.        |
| **lucide-react** | Conjunto de ícones SVG leves usados em toda a UI.   |
