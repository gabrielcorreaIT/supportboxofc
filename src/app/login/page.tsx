/**
 * Tela de entrada do sistema.
 *
 * Centraliza o formulário em uma caixa simples sobre o fundo neutro.
 * Como ainda não temos a parte que valida usuário e senha, o envio
 * apenas leva a pessoa para um dos dois painéis com base no e-mail
 * digitado. Se o e-mail tiver a palavra agente, vai para o painel
 * do agente. Caso contrário, vai para o portal do solicitante.
 *
 * Esse desvio é só para a apresentação. Quando a autenticação for
 * adicionada, o formulário em si não precisa mudar.
 */
"use client";

import { useRouter } from "next/navigation";
import { FormularioLogin } from "@/views/auth/FormularioLogin";

export default function PaginaLogin() {
  const router = useRouter();

  // Sem autenticação real ainda. Só direciona com base no e-mail.
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
