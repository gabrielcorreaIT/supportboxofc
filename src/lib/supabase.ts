/**
 * ============================================================================
 * INFRAESTRUTURA: Cliente de Banco de Dados (Server-Side Only)
 * ARQUIVO: src/lib/supabase.ts
 * ============================================================================
 * DESCRIÇÃO:
 * Instância única do Supabase para toda a aplicação.
 * Como adotamos a arquitetura MVC com Server Actions, este arquivo
 * roda ESTRITAMENTE no servidor (Node.js). Portanto, as variáveis de
 * ambiente NÃO usam o prefixo NEXT_PUBLIC_, garantindo que a URL e as
 * chaves do banco jamais vazem para o navegador dos solicitantes.
 * ============================================================================
 */
import { createClient } from "@supabase/supabase-js";

// Lendo as variáveis privadas que só existem no lado do servidor
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Fail Fast: Impede a aplicação de subir se as chaves não estiverem configuradas
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "⚠️ FALHA CRÍTICA DE INFRAESTRUTURA: Variáveis de ambiente do Supabase (SUPABASE_URL ou SUPABASE_ANON_KEY) não encontradas no arquivo .env.local.",
  );
}

// Cliente exportado para ser consumido EXCLUSIVAMENTE pela camada Model
export const supabase = createClient(supabaseUrl, supabaseKey);
