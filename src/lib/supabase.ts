/**
 * ============================================================================
 * INFRAESTRUTURA: Cliente Supabase (Server-Side Only)
 * ARQUIVO: src/lib/supabase.ts
 * ============================================================================
 * DESCRICAO:
 * Instancia unica do Supabase para toda a aplicacao.
 * Roda ESTRITAMENTE no servidor via Server Actions — as variaveis de
 * ambiente NAO usam NEXT_PUBLIC_, garantindo que as chaves jamais
 * vazem para o navegador.
 * ============================================================================
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
