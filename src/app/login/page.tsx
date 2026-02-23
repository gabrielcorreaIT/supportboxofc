/**
 * ============================================================================
 * COMPONENTE: LoginPage (Tela de Login do Solicitante)
 * PROJETO: SupportBox
 * ============================================================================
 * * DESCRIÇÃO:
 * Esta é a porta de entrada para os usuários comuns (solicitantes) do sistema.
 * Permite a autenticação para acesso ao painel de abertura de chamados.
 * * * ARQUITETURA E ESTADO:
 * - Utiliza "use client" pois gerencia estados de input, loading e modais.
 * - Integração com componentes UI padronizados (Card, Dialog, Input).
 * - NOTA: A autenticação atual utiliza dados "Mock" (simulados) para fins de
 * apresentação. Em produção, a função `handleLogin` deve ser conectada
 * ao backend real.
 */

"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Mail, CheckCircle } from "lucide-react";

export default function LoginPage() {
  // =========================================================================
  // 1. ESTADOS DO COMPONENTE E ROTEAMENTO
  // =========================================================================
  const router = useRouter();

  // Controle dos campos do formulário
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Controle de interface (Feedback visual)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Controle do Modal de Esqueci a Senha
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  // CREDENCIAIS DE TESTE (Mock para apresentação)
  const validUsername = "solicitante@hotmail.com";
  const validPassword = "unigoias123";

  // =========================================================================
  // 2. FUNÇÕES DE AÇÃO (HANDLERS)
  // =========================================================================

  /**
   * handleLogin: Executada ao submeter o formulário.
   * Faz a validação dos campos, simula um tempo de carregamento de rede
   * e valida as credenciais contra os dados de teste.
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento padrão da página
    setError(""); // Limpa erros anteriores

    // Validação inicial
    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true); // Ativa o estado de carregamento do botão

    // Simulando uma chamada assíncrona de API (delay de 1.5s)
    setTimeout(() => {
      setIsLoading(false);

      // Verificação das credenciais mockadas
      if (username === validUsername && password === validPassword) {
        router.push("/dashboard"); // Redireciona para o painel do solicitante
      } else {
        setError("Usuário ou senha incorretos. Tente novamente.");
      }
    }, 1500);
  };

  /**
   * handleForgotPassword: Executada ao clicar em "Esqueceu a senha?".
   * Captura o e-mail digitado (ou o e-mail válido de teste) e abre o Modal de aviso.
   */
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Impede que o clique dispare o envio do formulário sem querer

    setRecoveryEmail(username || validUsername);
    setForgotPasswordOpen(true); // Abre a janela de diálogo (Dialog)
  };

  // =========================================================================
  // 3. RENDERIZAÇÃO DA INTERFACE (JSX)
  // =========================================================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* --- CARTÃO PRINCIPAL DE LOGIN --- */}
      <Card className="w-full max-w-md border-supportbox/20">
        {/* Cabeçalho com Logo e Título */}
        <CardHeader className="space-y-4 items-center text-center">
          <div className="flex flex-col items-center space-y-4">
            <img
              src="/IconeLogo.jpg"
              alt="Logo SupportBox"
              className="w-32 h-32 object-contain"
            />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              SupportBox
            </h1>
            <CardDescription>Sistema de Suporte de TI</CardDescription>
          </div>
        </CardHeader>

        {/* Corpo do Cartão: Formulário */}
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Mensagem de Erro Condicional */}
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Campo: E-mail */}
            <div className="space-y-2">
              <Label htmlFor="username">E-mail</Label>
              <Input
                id="username"
                type="email"
                placeholder="Seu e-mail"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-supportbox/20 focus:ring-supportbox/30"
                disabled={isLoading}
              />
            </div>

            {/* Campo: Senha e Link de Recuperação */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <span
                  onClick={handleForgotPassword}
                  className="text-xs text-supportbox hover:underline cursor-pointer"
                >
                  Esqueceu a senha?
                </span>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-supportbox/20 focus:ring-supportbox/30"
                disabled={isLoading}
              />
            </div>

            {/* Checkbox: Lembrar de mim */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm">
                Lembrar de mim
              </Label>
            </div>

            {/* Botão de Submissão (Altera texto se estiver carregando) */}
            <Button
              type="submit"
              className="w-full bg-supportbox hover:bg-supportbox-dark"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>

        {/* Rodapé do Cartão */}
        <CardFooter className="flex justify-center border-t border-supportbox/10 pt-4">
          <p className="text-xs text-muted-foreground">
            © 2026 SupportBox. Todos os direitos reservados.
          </p>
        </CardFooter>
      </Card>

      {/* --- MODAL FLUTUANTE DE RECUPERAÇÃO DE SENHA (DIALOG) --- */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-supportbox/20 mb-4">
              <CheckCircle className="h-6 w-6 text-supportbox" />
            </div>
            <DialogTitle className="text-center">
              Instruções Enviadas
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              As instruções para redefinição de senha foram enviadas para o
              e-mail cadastrado:
              <div className="flex items-center justify-center gap-1 mt-2 font-medium">
                <Mail className="h-4 w-4" />
                <span>{recoveryEmail}</span>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-center">
            <Button
              variant="default"
              onClick={() => setForgotPasswordOpen(false)}
              className="bg-supportbox hover:bg-supportbox-dark"
            >
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
