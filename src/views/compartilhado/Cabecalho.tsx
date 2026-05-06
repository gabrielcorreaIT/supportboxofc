/**
 * Faixa superior usada nas páginas do solicitante. Mostra o nome do
 * sistema, o usuário entrado e o botão de sair.
 */
"use client";

import { LogOut } from "lucide-react";
import { Botao } from "./Botao";

interface PropsCabecalho {
  nomeUsuario: string;
  subtitulo?: string;
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
        <div>
          <h1 className="text-base font-semibold text-tinta tracking-tight">
            SupportBox
          </h1>
          {subtitulo && (
            <p className="text-xs text-tintaFraca">{subtitulo}</p>
          )}
        </div>

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
