const fs = require("fs")
const path = require("path")
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} = require("docx")

// Função para criar o documento DGC em formato Word
async function generateDGCDocument() {
  const doc = new Document({
    creator: "Sistema SupportBox",
    title: "Documento de Gerenciamento de Configuração (DGC)",
    description: "Documento formal de GCS para o sistema SupportBox - Smart HelpDesk",

    sections: [
      {
        properties: {},
        headers: {
          default: new Paragraph({
            children: [
              new TextRun({
                text: "SupportBox - Documento de Gerenciamento de Configuração",
                size: 20,
                color: "666666",
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        },
        footers: {
          default: new Paragraph({
            children: [
              new TextRun({
                text: "Página ",
                size: 18,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        },
        children: [
          // Título Principal
          new Paragraph({
            children: [
              new TextRun({
                text: "DOCUMENTO DE GERENCIAMENTO DE CONFIGURAÇÃO (DGC)",
                bold: true,
                size: 32,
                color: "2563eb",
              }),
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Sistema SupportBox - Smart HelpDesk",
                bold: true,
                size: 24,
                color: "1f2937",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
          }),

          // 1. INTRODUÇÃO
          new Paragraph({
            children: [
              new TextRun({
                text: "1. INTRODUÇÃO",
                bold: true,
                size: 24,
                color: "1f2937",
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "1.1 Objetivo",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Este documento estabelece as diretrizes, processos e procedimentos para o Gerenciamento de Configuração de Software (GCS) do sistema SupportBox, garantindo controle, rastreabilidade e qualidade dos itens de configuração ao longo do ciclo de vida do software.",
                size: 22,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "1.2 Escopo",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "O documento abrange todos os componentes do sistema SupportBox, incluindo código-fonte, documentação, ambientes de execução, dependências e infraestrutura de suporte.",
                size: 22,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "1.3 Referências Normativas",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "• IEEE 610.12-1990 - Standard Glossary of Software Engineering Terminology\n• ISO/IEC 12207 - Systems and Software Engineering Life Cycle Processes\n• ITIL v4 - Information Technology Infrastructure Library\n• CMMI-DEV v2.0 - Capability Maturity Model Integration for Development",
                size: 22,
              }),
            ],
            spacing: { after: 400 },
          }),

          // 2. DEFINIÇÕES E TERMOS-CHAVE
          new Paragraph({
            children: [
              new TextRun({
                text: "2. DEFINIÇÕES E TERMOS-CHAVE",
                bold: true,
                size: 24,
                color: "1f2937",
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          // Tabela de Definições
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Termo", bold: true, size: 20 })],
                      }),
                    ],
                    width: { size: 30, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Definição", bold: true, size: 20 })],
                      }),
                    ],
                    width: { size: 70, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Item de Configuração (IC)", size: 18 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Entidade designada para gerenciamento de configuração", size: 18 }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Baseline", size: 18 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Versão aprovada e controlada de um IC", size: 18 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Versionamento", size: 18 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Processo de atribuição de identificadores únicos às versões",
                            size: 18,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Auditoria de Configuração", size: 18 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Verificação formal da conformidade dos ICs", size: 18 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Rastreabilidade", size: 18 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Capacidade de rastrear relacionamentos entre ICs", size: 18 })],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // 3. POLÍTICA DE GERENCIAMENTO DE CONFIGURAÇÃO
          new Paragraph({
            children: [
              new TextRun({
                text: "3. POLÍTICA DE GERENCIAMENTO DE CONFIGURAÇÃO",
                bold: true,
                size: 24,
                color: "1f2937",
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "3.1 Princípios Fundamentais",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "• Controle Total: Todos os ICs devem estar sob controle de versão\n• Rastreabilidade Completa: Relacionamentos entre ICs devem ser documentados\n• Auditoria Regular: Verificações periódicas de conformidade\n• Processo Formal: Mudanças seguem fluxo de aprovação definido",
                size: 22,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "3.2 Estratégia de Versionamento",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "• Versionamento Semântico: MAJOR.MINOR.PATCH (ex: 1.2.3)\n• Branches: main (produção), develop (desenvolvimento), feature/* (funcionalidades)\n• Tags: Marcação de releases estáveis",
                size: 22,
              }),
            ],
            spacing: { after: 400 },
          }),

          // 4. ITENS DE CONFIGURAÇÃO IDENTIFICADOS
          new Paragraph({
            children: [
              new TextRun({
                text: "4. ITENS DE CONFIGURAÇÃO IDENTIFICADOS",
                bold: true,
                size: 24,
                color: "1f2937",
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "4.1 Código-Fonte (CS)",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          // Tabela de Código-Fonte
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "ID", bold: true, size: 18 })],
                      }),
                    ],
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Item de Configuração", bold: true, size: 18 })],
                      }),
                    ],
                    width: { size: 40, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Localização", bold: true, size: 18 })],
                      }),
                    ],
                    width: { size: 30, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Responsável", bold: true, size: 18 })],
                      }),
                    ],
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "CS-001", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Página Principal", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "/app/page.tsx", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Dev Frontend", size: 16 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "CS-002", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Página de Login", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "/app/login/page.tsx", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Dev Frontend", size: 16 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "CS-003", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Dashboard", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "/app/dashboard/page.tsx", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Dev Frontend", size: 16 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "CS-004", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Detalhes do Chamado", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "/app/ticket/[id]/page.tsx", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Dev Frontend", size: 16 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "CS-005", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Formulário de Chamado", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "/components/ticket-form.tsx", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Dev Frontend", size: 16 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "CS-006", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Lista de Chamados", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "/components/ticket-list.tsx", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Dev Frontend", size: 16 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "CS-007", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Navegação do Usuário", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "/components/user-nav.tsx", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Dev Frontend", size: 16 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "CS-008", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Componente Logo", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "/components/logo.tsx", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Dev Frontend", size: 16 })],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Quebra de página
          new Paragraph({
            children: [new TextRun({ text: "", size: 1 })],
            pageBreakBefore: true,
          }),

          // 5. PROCESSOS DE CONTROLE DE CONFIGURAÇÃO
          new Paragraph({
            children: [
              new TextRun({
                text: "5. PROCESSOS DE CONTROLE DE CONFIGURAÇÃO",
                bold: true,
                size: 24,
                color: "1f2937",
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "5.1 Fluxo de Mudanças",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Solicitação → Análise → Aprovação → Implementação → Teste → Deploy → Verificação",
                size: 22,
                bold: true,
                color: "2563eb",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "5.2 Controle de Versões",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Ferramenta: Git\nRepositório: Sistema centralizado\nEstratégia de Branch:\n• main: Código em produção\n• develop: Integração de funcionalidades\n• feature/*: Desenvolvimento de funcionalidades\n• hotfix/*: Correções urgentes",
                size: 22,
              }),
            ],
            spacing: { after: 200 },
          }),

          // 6. REGISTRO DE STATUS DE CONFIGURAÇÃO
          new Paragraph({
            children: [
              new TextRun({
                text: "6. REGISTRO DE STATUS DE CONFIGURAÇÃO",
                bold: true,
                size: 24,
                color: "1f2937",
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "6.1 Matriz de Rastreabilidade",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          // Tabela de Rastreabilidade
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Requisito", bold: true, size: 18 })],
                      }),
                    ],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Componente", bold: true, size: 18 })],
                      }),
                    ],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Teste", bold: true, size: 18 })],
                      }),
                    ],
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Documentação", bold: true, size: 18 })],
                      }),
                    ],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Status", bold: true, size: 18 })],
                      }),
                    ],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "REQ-001: Login de Usuário", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "CS-002", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "TEST-001", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "DOC-001", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "✅ Implementado", size: 16, color: "16a34a" })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "REQ-002: Criação de Chamado", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "CS-005", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "TEST-002", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "DOC-002", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "✅ Implementado", size: 16, color: "16a34a" })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "REQ-003: Listagem de Chamados", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "CS-006", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "TEST-003", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "DOC-003", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "✅ Implementado", size: 16, color: "16a34a" })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "REQ-004: Detalhes do Chamado", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "CS-004", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "TEST-004", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "DOC-004", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "✅ Implementado", size: 16, color: "16a34a" })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "REQ-005: Navegação do Sistema", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "CS-007", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "TEST-005", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "DOC-005", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "✅ Implementado", size: 16, color: "16a34a" })],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // 7. PROCESSO DE AUDITORIA E VERIFICAÇÃO
          new Paragraph({
            children: [
              new TextRun({
                text: "7. PROCESSO DE AUDITORIA E VERIFICAÇÃO",
                bold: true,
                size: 24,
                color: "1f2937",
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "7.1 Tipos de Auditoria",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "• Auditoria Funcional: Verificação se os ICs atendem aos requisitos especificados\n• Auditoria Física: Verificação da integridade e completude dos ICs\n• Auditoria de Processo: Verificação da aderência aos processos definidos",
                size: 22,
              }),
            ],
            spacing: { after: 200 },
          }),

          // 8. FERRAMENTAS E TECNOLOGIAS
          new Paragraph({
            children: [
              new TextRun({
                text: "8. FERRAMENTAS E TECNOLOGIAS",
                bold: true,
                size: 24,
                color: "1f2937",
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "8.1 Ferramentas de Desenvolvimento",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          // Tabela de Ferramentas
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Categoria", bold: true, size: 18 })],
                      }),
                    ],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Ferramenta", bold: true, size: 18 })],
                      }),
                    ],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Versão", bold: true, size: 18 })],
                      }),
                    ],
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Propósito", bold: true, size: 18 })],
                      }),
                    ],
                    width: { size: 35, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Framework", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Next.js", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "14.x", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Desenvolvimento Frontend", size: 16 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Linguagem", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "TypeScript", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "5.x", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Tipagem Estática", size: 16 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Estilização", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Tailwind CSS", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "3.x", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Framework CSS", size: 16 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Controle de Versão", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Git", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "2.x", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Versionamento", size: 16 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Gerenciador de Pacotes", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "npm", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "10.x", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Dependências", size: 16 })],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // 9. PAPÉIS E RESPONSABILIDADES
          new Paragraph({
            children: [
              new TextRun({
                text: "9. PAPÉIS E RESPONSABILIDADES",
                bold: true,
                size: 24,
                color: "1f2937",
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "9.1 Descrição de Papéis",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Gerente de Configuração:",
                bold: true,
                size: 18,
              }),
            ],
            spacing: { after: 50 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "• Definir políticas e procedimentos de GCS\n• Coordenar auditorias de configuração\n• Manter documentação atualizada",
                size: 18,
              }),
            ],
            spacing: { after: 150 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Tech Lead:",
                bold: true,
                size: 18,
              }),
            ],
            spacing: { after: 50 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "• Aprovar mudanças técnicas\n• Definir arquitetura e padrões\n• Revisar código crítico",
                size: 18,
              }),
            ],
            spacing: { after: 150 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Desenvolvedor Frontend:",
                bold: true,
                size: 18,
              }),
            ],
            spacing: { after: 50 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "• Implementar funcionalidades\n• Seguir padrões de codificação\n• Documentar componentes",
                size: 18,
              }),
            ],
            spacing: { after: 200 },
          }),

          // 10. MÉTRICAS E INDICADORES DE DESEMPENHO
          new Paragraph({
            children: [
              new TextRun({
                text: "10. MÉTRICAS E INDICADORES DE DESEMPENHO",
                bold: true,
                size: 24,
                color: "1f2937",
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "10.1 Métricas de Controle",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          // Tabela de Métricas
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Métrica", bold: true, size: 18 })],
                      }),
                    ],
                    width: { size: 40, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Meta", bold: true, size: 18 })],
                      }),
                    ],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Atual", bold: true, size: 18 })],
                      }),
                    ],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Status", bold: true, size: 18 })],
                      }),
                    ],
                    width: { size: 20, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "% ICs sob controle de versão", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "100%", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "100%", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "✅", size: 16, color: "16a34a" })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Tempo médio de aprovação (horas)", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "< 48h", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "36h", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "✅", size: 16, color: "16a34a" })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "% Auditorias bem-sucedidas", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "> 95%", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "98%", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "✅", size: 16, color: "16a34a" })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Número de conflitos de merge/mês", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "< 5", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "2", size: 16 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "✅", size: 16, color: "16a34a" })],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // 11. CONCLUSÃO E PRÓXIMOS PASSOS
          new Paragraph({
            children: [
              new TextRun({
                text: "11. CONCLUSÃO E PRÓXIMOS PASSOS",
                bold: true,
                size: 24,
                color: "1f2937",
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "11.1 Status Atual",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "O sistema SupportBox apresenta um nível maduro de gerenciamento de configuração, com todos os itens identificados, controlados e rastreáveis. A arquitetura modular facilita a manutenção e evolução do sistema.",
                size: 22,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "11.2 Próximos Passos",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "1. Implementar CI/CD: Automatizar pipeline de deploy\n2. Integração com CMDB: Centralizar informações de configuração\n3. Métricas Avançadas: Implementar dashboards de monitoramento\n4. Treinamento da Equipe: Capacitar em melhores práticas de GCS",
                size: 22,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "11.3 Recomendações",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "• Manter periodicidade das auditorias\n• Investir em automação de processos\n• Estabelecer cultura de qualidade na equipe\n• Documentar lições aprendidas",
                size: 22,
              }),
            ],
            spacing: { after: 400 },
          }),

          // Rodapé do documento
          new Paragraph({
            children: [
              new TextRun({
                text: "Documento elaborado em conformidade com IEEE 610.12-1990, ISO/IEC 12207, ITIL v4 e CMMI-DEV v2.0",
                size: 18,
                italics: true,
                color: "666666",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Versão: 1.0 | Data: Janeiro 2024 | Responsável: Especialista em GCS",
                size: 18,
                bold: true,
                color: "2563eb",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
        ],
      },
    ],
  })

  // Gerar o arquivo Word
  const buffer = await Packer.toBuffer(doc)

  // Salvar o arquivo
  const outputPath = path.join(process.cwd(), "DGC-SupportBox-v1.0.docx")
  fs.writeFileSync(outputPath, buffer)

  console.log(`✅ Documento DGC gerado com sucesso: ${outputPath}`)
  console.log(`📄 Arquivo: DGC-SupportBox-v1.0.docx`)
  console.log(`📊 Tamanho: ${(buffer.length / 1024).toFixed(2)} KB`)

  return outputPath
}

// Executar a geração do documento
generateDGCDocument()
  .then((filePath) => {
    console.log(`\n🎉 Documento Word do DGC criado com sucesso!`)
    console.log(`📁 Localização: ${filePath}`)
    console.log(`\n📋 Conteúdo incluído:`)
    console.log(`   • Introdução e objetivos`)
    console.log(`   • Definições e termos-chave`)
    console.log(`   • Política de gerenciamento`)
    console.log(`   • Itens de configuração identificados`)
    console.log(`   • Processos de controle`)
    console.log(`   • Matriz de rastreabilidade`)
    console.log(`   • Auditorias e verificações`)
    console.log(`   • Ferramentas e tecnologias`)
    console.log(`   • Papéis e responsabilidades`)
    console.log(`   • Métricas e indicadores`)
    console.log(`   • Conclusões e próximos passos`)
  })
  .catch((error) => {
    console.error("❌ Erro ao gerar documento:", error)
  })
