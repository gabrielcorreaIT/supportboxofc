# SupportBox

Sistema interno de atendimento de TI. Versão acadêmica em construção.

> Estado atual: primeira etapa pronta, com as telas funcionando.
> As regras de uso e a parte de banco serão adicionadas nas
> próximas etapas, sem alterar o que já está pronto aqui.

## 1. O que faz

O SupportBox permite abrir e acompanhar chamados de TI. Há dois tipos
de usuário:

| Quem é          | O que pode fazer                                                |
| --------------- | --------------------------------------------------------------- |
| Solicitante     | Abrir chamados, ver os próprios chamados, comentar.             |
| Agente          | Ver todos os chamados, filtrar, assumir, concluir, comentar.    |

Esta primeira entrega traz só a parte visual funcionando, com dados
de exemplo. Não há banco, não há validação real de acesso e não há
regras de uso ainda. As listas e os detalhes vêm do arquivo
`src/views/compartilhado/dados-de-exemplo.ts`.

## 2. Como rodar

```bash
# Instalar as dependências
npm install

# Rodar em modo desenvolvimento (http://localhost:3000)
npm run dev

# Gerar a versão de produção
npm run build && npm start
```

Pré-requisitos: Node.js 18 ou mais novo, e npm 9 ou mais novo.

### Roteiro para a apresentação

1. Acesse `http://localhost:3000`. O sistema redireciona para a tela
   de entrada em `/login`.
2. Use qualquer e-mail e qualquer senha. O acesso ainda não é
   validado.
   - Se o e-mail tiver a palavra "agente" (por exemplo,
     `marcos.agente@empresa.com`), o usuário entra no painel do
     agente.
   - Qualquer outro e-mail (por exemplo, `joana@empresa.com`) leva
     ao portal do solicitante.
3. Use o botão Sair para voltar à tela de entrada.

Quando a parte de autenticação for adicionada, o redirecionamento da
tela de entrada vai passar a fazer a validação de verdade. A tela
em si não muda.

## 3. Como o projeto está organizado

O sistema segue o padrão de três camadas. A regra é simples:

- A camada de **tela** mostra as informações e dispara as ações.
- A camada de **regras** orquestra o que precisa ser feito quando
  uma ação é disparada (por exemplo, ao criar um chamado).
- A camada de **dados** acessa o banco e devolve os dados prontos
  para a regra usar.

Nesta etapa só a primeira camada está pronta. Nos arquivos da pasta
`src/views`, os comentários indicam onde a camada de regras vai se
encaixar mais tarde.

### Princípios usados

Cada componente segue alguns princípios simples:

- **Cada parte cuida de uma coisa só.** O botão sabe ser botão. O
  formulário sabe coletar dados. A tabela sabe mostrar. Nada faz
  duas coisas ao mesmo tempo.
- **Aberto para crescer, fechado para mexer.** Para adicionar uma
  nova aparência de botão, basta incluir uma chave nova. A lógica
  do botão não muda.
- **As partes recebem o que precisam de fora.** Os componentes não
  buscam dados por conta própria. Eles recebem listas e funções pelas
  configurações de entrada. Isso permite trocar a origem dos dados
  no futuro sem alterar a parte visual.

## 4. Pastas e arquivos

```
.
├── README.md                este arquivo
├── next.config.mjs          ajustes do Next.js
├── postcss.config.mjs       PostCSS, que alimenta o Tailwind
├── tailwind.config.ts       paleta de cores e cantos
├── tsconfig.json            configuração do TypeScript
├── package.json             dependências e atalhos
└── src/
    ├── app/                 rotas do site
    │   ├── layout.tsx           moldura raiz com html e body
    │   ├── page.tsx             rota inicial, redireciona para /login
    │   ├── globals.css          estilos gerais e diretivas do Tailwind
    │   ├── login/page.tsx       /login
    │   ├── solicitante/
    │   │   ├── layout.tsx       envolve as telas do solicitante
    │   │   └── page.tsx         /solicitante
    │   └── agente/
    │       ├── layout.tsx       coloca a barra lateral fixa
    │       └── page.tsx         /agente
    │
    └── views/               componentes que formam as telas
        ├── compartilhado/       usados por todas as áreas
        │   ├── tipos-view.ts          formatos de dados das telas
        │   ├── dados-de-exemplo.ts          dados de exemplo
        │   ├── Botao.tsx              botão padrão
        │   ├── Cabecalho.tsx          faixa superior do solicitante
        │   ├── CampoTexto.tsx         campo de uma linha
        │   ├── CampoTextoArea.tsx     campo de várias linhas
        │   ├── CampoSelect.tsx        campo de seleção
        │   ├── Etiqueta.tsx           marcação colorida
        │   └── ModalDetalhesChamado.tsx janela de detalhes do chamado
        │
        ├── auth/
        │   └── FormularioLogin.tsx    coleta e-mail e senha
        │
        ├── solicitante/
        │   ├── PainelSolicitante.tsx     monta a tela do solicitante
        │   ├── FormularioAberturaChamado.tsx
        │   └── ListaMeusChamados.tsx
        │
        └── agente/
            ├── MenuLateralAgente.tsx     barra lateral do agente
            ├── PainelAgente.tsx          monta a tela do agente
            ├── BarraFiltros.tsx          busca e abas de situação
            └── TabelaChamados.tsx        tabela de chamados
```

### Por que duas pastas, `src/app` e `src/views`?

A pasta `src/app` existe porque o Next.js exige. É lá que ficam as
rotas do site. Os arquivos dela são bem curtos: cada um importa um
componente da pasta `src/views`, passa as informações necessárias e
desenha.

A pasta `src/views` é onde a interface visual de fato vive. É a
parte que pode ser reaproveitada se um dia o time mudar de
ferramenta.

## 5. Como os dados fluem

### Hoje, só com a camada visual

```
src/app/.../page.tsx          →   src/views/...
(lê os dados de exemplo)          (mostra a tela)
```

A página importa direto do arquivo de dados de exemplo e passa as
listas e as funções de ação para os componentes. As funções, por
enquanto, só registram no console.

### Mais tarde, com as regras de uso e o banco

```
src/app/.../page.tsx     →    Regra de uso     →    Banco
                              (orquestra)            (lê e grava)
                          ↑
                      devolve os dados prontos
                          ↓
                     src/views/... (não muda)
```

Os componentes da pasta `src/views` ficam iguais. O que muda é a
origem dos dados: em vez de importar do arquivo de exemplo, a
página passa a chamar a regra correspondente.

## 6. Convenções

- Tudo em português: nomes de arquivo, variáveis, comentários e
  textos da tela. O projeto é apresentado em sala, então o leitor
  é brasileiro.
- Cada arquivo começa com um comentário curto explicando o que ele
  faz. Mantenha esse padrão ao criar arquivos novos.
- A aparência usa o Tailwind com cores semânticas como `marca`,
  `tinta` e `linha`, definidas em `tailwind.config.ts`. Evite
  códigos de cor direto no componente.
- Os componentes guardam apenas estado de tela, como qual janela
  está aberta. Tudo que mexe com os dados será responsabilidade da
  camada de regras.
- A acessibilidade básica está prevista: cada campo tem um rótulo
  associado, a janela de detalhes usa `role="dialog"` e o foco fica
  visível ao navegar pelo teclado.

## 7. O que vem pela frente

- [x] Primeira etapa: telas, componentes reaproveitáveis e dados
      de exemplo.
- [ ] Segunda etapa: regras de uso, como entrar, criar chamado,
      listar, assumir, concluir e comentar.
- [ ] Terceira etapa: banco de dados e validação real de acesso.
- [ ] Quarta etapa: triagem automática do chamado por inteligência
      artificial logo na abertura, sugerindo categoria e prioridade.

## 8. Ferramentas usadas

| Ferramenta       | Para que serve                                              |
| ---------------- | ----------------------------------------------------------- |
| Next.js 15       | Ferramenta de páginas em React, com rotas e renderização.   |
| React 19         | Biblioteca usada para montar as telas.                      |
| TypeScript       | Tipagem que ajuda a pegar erros antes de rodar.             |
| Tailwind CSS     | Estilo aplicado por classes prontas, com paleta semântica.  |
| lucide-react     | Conjunto de ícones em SVG, leves, usados em toda a tela.    |
