## 📸 Visualização

<div align="center">
<h3>🔐 Acesso ao Sistema</h3>
<img src="public/screenshots/login.png" width="800" alt="Tela de Login">
<br><br>

<h3>📊 Painel Principal (Dashboard)</h3>
<img src="public/screenshots/dashboard1.png" width="800" alt="Dashboard Principal">
<br><br>

<h3>✨ Funcionalidades de Chamados</h3>
<table>
<tr>
<td width="50%" align="center">
<h4>🆕 Abertura de Chamado</h4>
<img src="public/screenshots/dashboard2.png" width="100%" alt="Novo Chamado">
</td>
<td width="50%" align="center">
<h4>📋 Detalhes do Chamado</h4>
<img src="public/screenshots/dashboard3.png" width="100%" alt="Detalhes">
</td>
</tr>
</table>
</div>

## 📂 Estrutura Completa do Projeto

Abaixo está o mapeamento atualizado da arquitetura e dos arquivos do repositório, conforme a estrutura real do projeto:

```text
/ (Raiz do Projeto)
│
├── .next/                      # ⚙️ Gerado automaticamente pelo Next.js (build) — IGNORADO PELO GIT
├── node_modules/               # 📦 Dependências instaladas — IGNORADO PELO GIT
├── public/                     # 🖼️ Arquivos estáticos públicos (imagens, ícones, etc.)
│
├── scripts/                    # 🛠️ Scripts utilitários e de automação do projeto
│
├── src/                        # 🧠 Código-fonte principal da aplicação
│   └── app/                    # Estrutura baseada no App Router do Next.js
│       ├── components/         # Componentes de interface reutilizáveis
│       ├── dashboard/          # Módulo/páginas do painel principal
│       ├── lib/                # Funções utilitárias, helpers e configurações internas
│       ├── login/              # Rotas e telas relacionadas à autenticação
│       ├── ticket/             # Rotas e funcionalidades de gerenciamento de tickets
│       ├── globals.css         # Estilos globais da aplicação
│       ├── layout.tsx          # Layout raiz compartilhado entre as páginas
│       └── page.tsx            # Página inicial do sistema
│
├── styles/                     # 🎨 Arquivos adicionais de estilo (caso utilizados fora do App Router)
├── supportboxdocumentos/       # 📁 Documentações, anexos ou arquivos auxiliares do projeto
│
├── .gitignore                  # 🚫 Arquivos e pastas ignorados pelo Git
├── components.json             # 🧩 Configuração da biblioteca de UI (shadcn/ui)
├── next-env.d.ts               # 🏷️ Tipagens automáticas do Next.js para TypeScript
├── next.config.mjs             # ⚙️ Configurações do framework Next.js
├── package.json                # 📜 Dependências, scripts e metadados do projeto
├── package-lock.json           # 🔒 Lockfile de dependências (npm)
├── pnpm-lock.yaml              # 🔒 Lockfile de dependências (pnpm)
├── postcss.config.mjs          # 🎨 Configuração do PostCSS (usado pelo Tailwind CSS)
├── tailwind.config.ts          # 🖌️ Configuração do design system com Tailwind
├── tsconfig.json               # 🧾 Configuração do TypeScript
└── README.md                   # 📖 Documentação principal do repositório
```
