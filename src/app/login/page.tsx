/**
 * Tela de entrada do sistema.
 *
 * Centraliza o formulário de acesso em uma caixa simples sobre o
 * fundo neutro. Como ainda não temos a parte que valida usuário e
 * senha de verdade, o envio do formulário usa uma regra de atalho:
 * se o e-mail digitado contém a palavra agente, o usuário cai no
 * painel do agente. Qualquer outro e-mail leva ao portal do
 * solicitante. Esse atalho some quando a autenticação real for
 * adicionada e a tela em si não precisa mudar.
 *
 * O arquivo é marcado como "use client" porque usa o useRouter,
 * que só funciona no navegador.
 */
"use client";

import { useRouter } from "next/navigation";
import { FormularioLogin } from "@/views/auth/FormularioLogin";

export default function PaginaLogin() {
  const router = useRouter();

  /**
   * Decide para onde mandar o usuário com base no e-mail digitado.
   * Esta lógica é só para a apresentação. Quando a autenticação
   * estiver pronta, a função recebida em aoEnviar passa a fazer a
   * validação real e a redirecionar de acordo com o papel.
   */
  const aoEnviar = (email: string) => {
    const destino = email.toLowerCase().includes("agente")
      ? "/agente"
      : "/solicitante";
    router.push(destino);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-fundo">
      {/* Identificação do sistema acima do formulário. */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-tinta">SupportBox</h1>
        <p className="text-sm text-tintaFraca">
          Sistema interno de atendimento de TI
        </p>
      </div>

      <FormularioLogin aoEnviar={aoEnviar} />

      {/*
        Aviso para o avaliador. Lembra que a tela existe mas não
        valida nada de verdade nesta etapa.
      */}
      <p className="text-xs text-tintaFraca mt-6 text-center max-w-sm">
        Esta é a etapa de apresentação. O acesso ainda não é validado
        de verdade. Use um e-mail com a palavra &quot;agente&quot; para
        entrar como técnico, ou qualquer outro endereço para entrar
        como solicitante.
      </p>
    </main>
  );
}
