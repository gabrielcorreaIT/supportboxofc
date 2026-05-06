/**
 * Tela de entrada do sistema. Como ainda não há validação real, o
 * envio leva o usuário para um dos dois painéis com base no e-mail:
 * com a palavra agente vai para /agente, qualquer outro vai para
 * /solicitante. Esse atalho some quando a autenticação for adicionada.
 */
"use client";

import { useRouter } from "next/navigation";
import { FormularioLogin } from "@/views/auth/FormularioLogin";

export default function PaginaLogin() {
  const router = useRouter();

  const aoEnviar = (email: string) => {
    const destino = email.toLowerCase().includes("agente")
      ? "/agente"
      : "/solicitante";
    router.push(destino);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-fundo">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-tinta">SupportBox</h1>
        <p className="text-sm text-tintaFraca">
          Sistema interno de atendimento de TI
        </p>
      </div>

      <FormularioLogin aoEnviar={aoEnviar} />

      <p className="text-xs text-tintaFraca mt-6 text-center max-w-sm">
        Esta é a etapa de apresentação. O acesso ainda não é validado de
        verdade. Use um e-mail com a palavra &quot;agente&quot; para entrar
        como técnico, ou qualquer outro endereço para entrar como
        solicitante.
      </p>
    </main>
  );
}
