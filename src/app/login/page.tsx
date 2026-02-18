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
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const validUsername = "gabrielbor28@hotmail.com";
  const validPassword = "Uni@2025";
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);

    // Simulando uma chamada de API de autenticação
    setTimeout(() => {
      setIsLoading(false);

      // Verificar se as credenciais correspondem às definidas
      if (username === validUsername && password === validPassword) {
        router.push("/dashboard");
      } else {
        setError("Usuário ou senha incorretos. Tente novamente.");
      }
    }, 1500);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Impede que o evento se propague para o formulário
    setRecoveryEmail(username || validUsername);
    setForgotPasswordOpen(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border-supportbox/20">
        <CardHeader className="space-y-4 items-center text-center">
          <div className="flex flex-col items-center space-y-4">
            {/* Imagem corrigida para usar o arquivo exato da pasta public */}
            <img
              src="/IconeLogo.jpg"
              alt="Logo SupportBox"
              className="w-32 h-32 object-contain"
            />

            {/* O Título do Sistema */}
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              SupportBox
            </h1>

            <CardDescription>Sistema de Suporte de TI</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

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

            <Button
              type="submit"
              className="w-full bg-supportbox hover:bg-supportbox-dark"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-supportbox/10 pt-4">
          <p className="text-xs text-muted-foreground">
            © 2026 SupportBox. Todos os direitos reservados.
          </p>
        </CardFooter>
      </Card>

      {/* Dialog para recuperação de senha */}
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
