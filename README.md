# SupportBox

Sistema interno de atendimento de TI.

> Estado atual: primeira etapa pronta, com as telas funcionando.
> As regras de negócio e a parte de banco serão adicionadas nas
> próximas etapas.

## 1. O que faz

O SupportBox permite abrir e acompanhar chamados de TI. Há dois tipos
de usuário:

| Quem é      | O que pode fazer                                             |
| ----------- | ------------------------------------------------------------ |
| Solicitante | Abrir chamados, ver os próprios chamados, comentar.          |
| Agente      | Ver todos os chamados, filtrar, assumir, concluir, comentar. |

Esta primeira etapa traz só a parte visual funcionando, com dados mockados.
Não há banco, não há validação real de acesso e não há
regras de negócio ainda.

## 2. Como rodar em sua máquina, jovem gafanhoto?

# Instalar as dependências:

npm install

# Rodar em modo desenvolvimento (http://localhost:3000):

npm run dev

# Gerar a versão de produção:

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



## 3. Como o projeto está organizado:

O sistema segue a arquitetura em camadas, orientado ao padrão de desenvolvimento MVC. Sendo:
View - Elementos de Tela;
Controller - Conecta as requisições da View até a Camada de Serviço;
Service Layer - Valida regras de negócio;
Model - Persistência de Dados.

Nesta etapa só a camada de View está pronta, podendo ser localizada no caminho: src -> views.


### Princípios usados:

Cada componente segue alguns princípios do SOLID:

- Responsabilidade Única (SRP): cada componente tem um papel claro.
  O botão é botão, o formulário coleta dados, a tabela exibe. Ninguém
  acumula funções.
- Aberto/Fechado (OCP): é possível "estender" sem mexer no que já existe.
  Para adicionar uma nova variante de botão, basta registrar uma chave
  nova, sem precisar alterar a lógica.
- Inversão de Dependência (DIP): os componentes não buscam dados
  por conta própria, recebem listas e funções via argumentos. Assim, a
  origem dos dados pode mudar sem impactar a camada visual.


## 4. Raiz do Projeto:
```

.

## 4. Raiz do Projeto:

```
├── src/
│   ├── app/                                 rotas do site
│   │   ├── agente/
│   │   │   ├── layout.tsx                   coloca a barra lateral fixa
│   │   │   └── page.tsx                     /agente
│   │   ├── login/
│   │   │   └── page.tsx                     /login (tela de entrada)
│   │   ├── solicitante/
│   │   │   ├── layout.tsx                   envolve as telas do solicitante
│   │   │   └── page.tsx                     /solicitante
│   │   ├── globals.css                      estilos gerais e diretivas do Tailwind
│   │   ├── layout.tsx                       moldura raiz com html e body
│   │   └── page.tsx                         rota inicial, redireciona para /login
│   │
│   ├── views/                               componentes que formam as telas
│   │   ├── agente/
│   │   │   ├── BarraFiltros.tsx             busca e abas de situação de Tickets
│   │   │   ├── MenuLateralAgente.tsx        barra lateral do agente
│   │   │   ├── PainelAgente.tsx             monta a tela do agente
│   │   │   └── TabelaChamados.tsx           tabela de chamados
│   │   │
│   │   ├── auth/
│   │   │   └── FormularioLogin.tsx          coleta e-mail e senha para login
│   │   │
│   │   ├── compartilhado/                   elementos em comum usados por todas as telas do sistema (botões, faixas, campos...)
│   │   │   ├── Botao.tsx                    botão padrão
│   │   │   ├── Cabecalho.tsx                faixa superior do solicitante
│   │   │   ├── CampoSelect.tsx              campo de seleção
│   │   │   ├── CampoTexto.tsx               campo de uma linha
│   │   │   ├── CampoTextoArea.tsx           campo de várias linhas
│   │   │   ├── dados-de-exemplo.ts          dados de exemplo
│   │   │   ├── Etiqueta.tsx                 marcação colorida
│   │   │   ├── ModalDetalhesChamado.tsx     janela de detalhes do chamado
│   │   │   └── tipos-view.ts                formatos de dados das telas
│   │   │
│   │   └── solicitante/
│   │       ├── FormularioAberturaChamado.tsx  formulário de abertura de chamado
│   │       ├── ListaMeusChamados.tsx          lista dos chamados do solicitante
│   │       └── PainelSolicitante.tsx          monta a tela do solicitante
│   │
│   └── css.d.ts                             declaração de tipo para CSS global
│
├── next.config.mjs       -> ajustes do Next.js
├── package.json          -> dependências e atalhos
├── postcss.config.mjs    -> PostCSS, que alimenta o Tailwind
├── README.md             -> este arquivo
├── tailwind.config.ts    -> paleta de cores utilizadas nas páginas
└── tsconfig.json         -> configuração do TypeScript
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

### Hoje, só com a camada de view:

```

src/app/.../page.tsx → src/views/...
(lê os dados de exemplo) (mostra a tela)

```

A página importa direto do arquivo de dados de exemplo e passa as
listas e as funções de ação para os componentes.

## 6. Convenções:

- Cada arquivo começa com um comentário curto explicando o que ele
  faz. Mantenha esse padrão ao criar arquivos novos.
- A aparência usa o Tailwind com cores semânticas como `marca`,
  `cor` e `linha`, definidas em `tailwind.config.ts`. Evite
  códigos de cor direto no componente.
- Os componentes guardam apenas estado de tela, como qual janela
  está aberta. Tudo que mexe com os dados será responsabilidade da
  camada de regras.

## 7. O que vem pela frente:

- [x] Primeira etapa: telas, componentes reaproveitáveis e dados
      de exemplo.
- [ ] Segunda etapa: regras de negócio, autenticação melhorada, criar chamado,
      listar, assumir, concluir e comentar.
- [ ] Terceira etapa: banco de dados e validação real de acesso.
- [ ] Quarta etapa: triagem automática do chamado por inteligência
      artificial logo na abertura, sugerindo categoria e prioridade.

## 8. Ferramentas usadas:

| Ferramenta   | Para que serve                                             |
| ------------ | ---------------------------------------------------------- |
| Next.js 15   | Ferramenta de páginas em React, com rotas e renderização.  |
| React 19     | Biblioteca usada para montar as telas.                     |
| TypeScript   | Tipagem que ajuda a pegar erros antes de rodar.            |
| Tailwind CSS | Estilo aplicado por classes prontas, com paleta semântica. |
| lucide-react | Conjunto de ícones em SVG, leves, usados em toda a tela.   |

```

```
