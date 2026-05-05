/**
 * CAMADA: View (componente compartilhado)
 * ARQUIVO: src/views/compartilhado/Cabecalho.tsx
 *
 * RESPONSABILIDADE
 *   Faixa superior (header) usada pelas páginas do solicitante.
 *   Mostra o nome do sistema, o nome do usuário logado e um botão
 *   "Sair". O painel do agente usa um menu lateral (MenuLateralAgente)
 *   em vez deste cabeçalho.
 *
 * PRINCÍPIOS SOLID APLICADOS
 *   - SRP: cuida apenas da faixa superior. Não busca dados; recebe
 *          tudo via props.
 *   - DIP: o callback `aoSairClicado` é fornecido por quem usa o
 *          componente. Hoje é um no-op; quando o AuthController
 *          existir, a página passará `acaoLogout()` aqui.
 */
"use client";

import { LogOut } from "lucide-react";
import { Botao } from "./Botao";

interface PropsCabecalho {
  /** Nome do usuário logado, exibido à direita. */
  nomeUsuario: string;
  /** Linha de identificação do papel (ex.: "Portal do Solicitante"). */
  subtitulo?: string;
  /** Disparado ao clicar em "Sair". A página decide o que fazer. */
  aoSairClicado?: () => void;
}

export function Cabecalho({
  nomeUsuario,
  subtitulo,
  aoSairClicado,
}: PropsCabecalho) {
  return (
    <header className="bg-papel border-b border-linha">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logotipo textual — sem ícone colorido para reforçar a estética sóbria. */}
        <div>
          <h1 className="text-base font-semibold text-tinta tracking-tight">
            SupportBox
          </h1>
          {subtitulo && (
            <p className="text-xs text-tintaFraca">{subtitulo}</p>
          )}
        </div>

        {/* Identificação do usuário + botão de logout. */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-tintaFraca hidden sm:inline">
            {nomeUsuario}
          </span>
          <Botao variante="secundario" onClick={aoSairClicado}>
            <LogOut className="w-4 h-4" /> Sair
          </Botao>
        </div>
      </div>
    </header>
  );
}
