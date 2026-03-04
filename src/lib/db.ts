/**
 * ============================================================================
 * ARQUIVO: src/lib/db.ts
 * PROJETO: SupportBox
 * ============================================================================
 * DESCRIÇÃO:
 * Este arquivo atua como a Camada de Acesso a Dados (Data Access Layer).
 * Ele centraliza toda a comunicação da aplicação com o banco de dados
 * PostgreSQL hospedado na nuvem pelo Supabase.
 *
 * REGRAS DE NEGÓCIO DA ARQUITETURA:
 * O sistema foi projetado estritamente para gerenciar a comunicação interna
 * entre um setor de TI e seus solicitantes que abrem chamados. A adoção de
 * um banco real em nuvem permite que os chamados abertos pelos solicitantes
 * reflitam em tempo real no painel do setor de TI, preparando o terreno para
 * automações via Webhooks do Telegram.
 * ============================================================================
 */

import { createClient } from "@supabase/supabase-js";

// =========================================================================
// 1. CONFIGURAÇÃO E CONEXÃO COM O BANCO DE DADOS
// =========================================================================

// Variáveis de ambiente garantem que as chaves não fiquem expostas.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Instância global do cliente do Supabase.
 */
export const supabase = createClient(supabaseUrl, supabaseKey);

// =========================================================================
// 2. TIPAGENS (INTERFACES DE DOMÍNIO)
// =========================================================================

/**
 * Modelo de dados da tabela 'tickets'.
 * Define a estrutura exata de um chamado trafegado entre os setores.
 */
export type Ticket = {
  id: string; // Identificador e protocolo único (ex: CH-1234)
  requester: string; // Nome do colaborador solicitante
  title: string; // Resumo ou categoria do incidente
  status: string; // Estado atual (Aguardando Atendimento, Em Andamento, Concluído)
  priority: string; // Nível de criticidade (Baixa, Média, Alta, Urgente)
  date: string; // Data e hora do registro da solicitação
  description: string; // Relato completo do problema
};

// =========================================================================
// 3. SERVIÇOS DE BANCO DE DADOS (CRUD)
// =========================================================================

export const db = {
  /**
   * Busca todos os chamados registrados no banco de dados.
   * Utilizado para popular o dashboard de controle dos técnicos de TI.
   * * @returns {Promise<Ticket[]>} Lista ordenada do mais recente para o mais antigo.
   */
  getTickets: async (): Promise<Ticket[]> => {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Erro ao buscar chamados no Supabase:", error);
      return [];
    }

    return data || [];
  },

  /**
   * Busca um chamado específico pelo seu ID (Protocolo).
   * Utilizado pelo bot do Telegram para validar a existência do ticket.
   * * @param id - O número do protocolo (ex: CH-468).
   * @returns {Promise<Ticket | null>} Retorna os dados do chamado ou nulo se não existir.
   */
  getTicketById: async (id: string): Promise<Ticket | null> => {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Ticket;
  },

  /**
   * Cria um novo chamado no banco de dados com base no formulário do solicitante.
   * Contém regra de negócio para auto-categorizar a urgência.
   *
   * @param description - Texto relatando os detalhes do incidente.
   * @param category - Categoria do problema selecionada na triagem.
   * @param requester - Nome do colaborador solicitante.
   * @returns {Promise<string>} O número do protocolo (ID) gerado.
   */
  createTicket: async (
    description: string,
    category: string,
    requester: string = "Colaborador Logado",
  ): Promise<string> => {
    // Regra de Negócio: Elevação automática de prioridade
    const isUrgent =
      description.toLowerCase().includes("servidor") ||
      description.toLowerCase().includes("urgente");

    // Formatação de ID garantindo 4 dígitos padronizados
    const randomNum = Math.floor(Math.random() * 10000);
    const formattedNum = String(randomNum).padStart(4, "0");

    const newTicket: Ticket = {
      id: `CH-${formattedNum}`,
      requester: requester,
      title: category ? `Problema de ${category}` : "Novo Incidente",
      status: "Aguardando Atendimento",
      priority: isUrgent ? "Urgente" : "Média",
      date: new Date().toLocaleString("pt-BR"),
      description: description,
    };

    const { error } = await supabase.from("tickets").insert([newTicket]);

    if (error) {
      console.error("Erro ao inserir novo chamado no Supabase:", error);
    }

    return newTicket.id;
  },

  /**
   * Atualiza o estado de um chamado existente.
   * Utilizado quando a equipe de TI altera a situação de um ticket.
   *
   * @param id - O número do protocolo do chamado.
   * @param newStatus - O novo estado a ser gravado no banco.
   */
  updateTicketStatus: async (id: string, newStatus: string): Promise<void> => {
    const { error } = await supabase
      .from("tickets")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error(`Erro ao atualizar o status do chamado ${id}:`, error);
    }
  },
};
