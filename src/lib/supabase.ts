/**
 * CAMADA: Infraestrutura — Cliente Supabase
 * ARQUIVO: src/lib/supabase.ts
 *
 * DESCRICAO:
 *   Cria e exporta a instancia unica do Supabase usada por toda a
 *   aplicacao. O Supabase e o banco de dados do projeto (PostgreSQL
 *   na nuvem com autenticacao integrada).
 *
 *   IMPORTANTE: Este arquivo roda APENAS no servidor (via Server Actions).
 *   As variaveis de ambiente NAO usam NEXT_PUBLIC_, garantindo que as
 *   chaves de acesso ao banco jamais vazem para o navegador.
 *
 * CONEXOES:
 *   - Depende de: variaveis SUPABASE_URL e SUPABASE_ANON_KEY no .env.local
 *   - Usado por:  TicketModel (persistencia), AuthController (autenticacao)
 */
import { createClient } from "@supabase/supabase-js";

const urlSupabase = process.env.SUPABASE_URL;
const chaveSupabase = process.env.SUPABASE_ANON_KEY;

if (!urlSupabase || !chaveSupabase) {
  throw new Error(
    "FALHA CRITICA: Variaveis SUPABASE_URL ou SUPABASE_ANON_KEY nao encontradas no .env.local.",
  );
}

export const supabase = createClient(urlSupabase, chaveSupabase);
