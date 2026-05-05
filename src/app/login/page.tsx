/**
 * CAMADA: View (rota Next.js — Página de Login)
 * ARQUIVO: src/app/login/page.tsx
 *
 * RESPONSABILIDADE
 *   Página acessada em "/login". Centraliza o formulário de login
 *   numa caixa simples sobre fundo neutro.
 *
 *   Como NÃO há AuthController nesta etapa, o handler `aoEnviar`
 *   apenas redireciona o usuário para um dos dois painéis com base
 *   no e-mail digitado:
 *     - se o e-mail contém "agente"  -> /agente
 *     - caso contrário               -> /solicitante
 *
 *   Esse roteamento é PURAMENTE de demonstração. Quando o
 *   AuthController existir, o callback será trocado por uma chamada
 *   ao Controller, e o componente FormularioLogin não precisará
 *   mudar (ver princípio DIP do SOLID).
 */
"use client";

import { useRouter } from "next/navigation";
import { FormularioLogin } from "@/views/auth/FormularioLogin";

export default function PaginaLogin() {
  const router = useRouter();

  // Handler de demonstração — sem autenticação real.
  const aoEnviar = (email: string) => {
    const destino = email.toLowerCase().includes("agente")
      ? "/agente"
      : "/solicitante";
    router.push(destino);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-fundo">
      {/* Identidade da aplicação. */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-tinta">SupportBox</h1>
        <p className="text-sm text-tintaFraca">
          Sistema interno de Help Desk
        </p>
      </div>

      <FormularioLogin aoEnviar={aoEnviar} />

      <p className="text-xs text-tintaFraca mt-6 text-center max-w-sm">
        Etapa de apresentação: o login não autentica de fato. Use um e-mail
        contendo &quot;agente&quot; para entrar como técnico, ou qualquer
        outro endereço para entrar como solicitante.
      </p>
    </main>
  );
}
