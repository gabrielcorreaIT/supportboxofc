/**
 * Faixa superior usada nas páginas do solicitante.
 *
 * Mostra a identificação do sistema à esquerda, o nome do usuário
 * entrado e o botão para sair à direita. O painel do agente usa
 * uma barra lateral em vez deste cabeçalho, então o componente é
 * importado só pelas telas do solicitante.
 *
 * O cabeçalho não busca dados por conta própria. Recebe o nome do
 * usuário pronto e dispara aoSairClicado quando o usuário aperta
 * o botão. Quem usa o componente decide o que fazer no logout.
 */
"use client";

import { LogOut } from "lucide-react";
import { Botao } from "./Botao";

interface PropsCabecalho {
  /** Nome do usuário entrado, exibido à direita do cabeçalho. */
  nomeUsuario: string;
  /**
   * Texto curto de apoio que aparece embaixo do nome do sistema.
   * Útil para identificar de qual área o usuário faz parte, como
   * Portal do Solicitante.
   */
  subtitulo?: string;
  /**
   * Função chamada quando o usuário aperta o botão Sair. Ela
   * recebe a responsabilidade de desligar a sessão e mandar o
   * usuário para a tela de entrada.
   */
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
        {/*
          Identificação do sistema. Sem ícone colorido para reforçar
          a aparência sóbria das telas internas.
        */}
        <div>
          <h1 className="text-base font-semibold text-tinta tracking-tight">
            SupportBox
          </h1>
          {subtitulo && (
            <p className="text-xs text-tintaFraca">{subtitulo}</p>
          )}
        </div>

        {/*
          Identificação do usuário e botão de sair. O nome desaparece
          em telas pequenas para dar espaço ao botão.
        */}
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
