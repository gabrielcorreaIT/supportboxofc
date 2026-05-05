/**
 * Faixa superior usada nas páginas do solicitante.
 *
 * Mostra o nome do sistema, o nome do usuário entrado e o botão
 * para sair. O painel do agente usa uma barra lateral em vez deste
 * cabeçalho. O componente apenas desenha a faixa, sem buscar dados
 * por conta própria. O que acontece ao clicar em sair é
 * responsabilidade de quem usa, passando a função em
 * aoSairClicado.
 */
"use client";

import { LogOut } from "lucide-react";
import { Botao } from "./Botao";

interface PropsCabecalho {
  /** Nome do usuário entrado, exibido à direita. */
  nomeUsuario: string;
  /** Texto curto que identifica o papel, como Portal do Solicitante. */
  subtitulo?: string;
  /** Função chamada quando o usuário clica em Sair. */
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
