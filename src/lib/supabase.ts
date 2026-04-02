/**
 * ============================================================================
 * INFRAESTRUTURA: Cliente Supabase (Server-Side Only)
 * ARQUIVO: src/lib/supabase.ts
 * ============================================================================
 * DESCRIÇÃO:
 * Instância única do Supabase para toda a aplicação.
 * Roda ESTRITAMENTE no servidor via Server Actions — as variáveis de
 * ambiente NÃO usam NEXT_PUBLIC_, garantindo que as chaves jamais
 * vazem para o navegador.
 * ============================================================================
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "⚠️ FALHA CRÍTICA: Variáveis SUPABASE_URL ou SUPABASE_ANON_KEY não encontradas no .env.local.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
