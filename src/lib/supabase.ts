/**
 * CAMADA: Infraestrutura — Cliente Supabase
 * ARQUIVO: src/lib/supabase.ts
 *
 * DESCRICAO:
 *   Cria e exporta a instancia unica do Supabase usada por toda a aplicacao.
 *   O Supabase e o banco de dados do projeto (PostgreSQL na nuvem com
 *   autenticacao integrada).
 *
 * CONEXOES:
 *   - Depende de: variaveis SUPABASE_URL e SUPABASE_ANON_KEY no .env.local
 *   - Usado por:  TicketModel (persistencia), AuthController (autenticacao)
 */
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_ANON_KEY ?? "",
);
