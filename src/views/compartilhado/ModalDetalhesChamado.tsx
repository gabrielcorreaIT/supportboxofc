/**
 * Janela sobreposta com os detalhes de um chamado. Mostra dados
 * gerais, descrição completa e histórico de comentários. É a mesma
 * janela usada pelo solicitante e pelo agente, com a flag modoAgente
 * controlando quando aparecem os botões de assumir e concluir.
 */
"use client";

import { useState } from "react";
import { CheckCircle, Clock, Send, Tag, User, UserCheck, X } from "lucide-react";
import type { ChamadoDetalhado } from "./tipos-view";
import { Botao } from "./Botao";
import { Etiqueta, corPorPrioridade, corPorStatus } from "./Etiqueta";

interface PropsModalDetalhesChamado {
  chamado: ChamadoDetalhado | null;
  aberto: boolean;
  aoFechar: () => void;
  modoAgente?: boolean;
  aoAssumir?: () => void;
  aoConcluir?: () => void;
  aoEnviarComentario?: (texto: string) => void;
}

export function ModalDetalhesChamado({
  chamado,
  aberto,
  aoFechar,
  modoAgente = false,
  aoAssumir,
  aoConcluir,
  aoEnviarComentario,
}: PropsModalDetalhesChamado) {
  const [textoComentario, setTextoComentario] = useState("");

  if (!aberto || !chamado) return null;

  const enviar = () => {
    const texto = textoComentario.trim();
    if (!texto) return;
    aoEnviarComentario?.(texto);
    setTextoComentario("");
  };

  const concluido = chamado.status === "Concluído";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => e.target === e.currentTarget && aoFechar()}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-papel border border-linha rounded-md shadow">
        <div className="p-5 border-b border-linha flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-marca-forte mb-2">
              <Tag className="w-3 h-3" />
              {chamado.protocolo}
            </span>
            <h2 className="text-lg font-semibold text-tinta">
              {chamado.titulo}
            </h2>
          </div>
          <button
            onClick={aoFechar}
            className="p-1 rounded hover:bg-fundo text-tintaFraca"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 border-b border-linha grid grid-cols-2 gap-4 bg-fundo/60">
          <Metadado titulo="Solicitante" icone={<User className="w-4 h-4" />}>
            {chamado.solicitante}
          </Metadado>
          <Metadado titulo="Aberto em" icone={<Clock className="w-4 h-4" />}>
            {chamado.criadoEmFormatado}
          </Metadado>
          <Metadado titulo="Categoria">{chamado.categoria}</Metadado>
          <Metadado titulo="Prioridade">
            <Etiqueta classeCor={corPorPrioridade(chamado.prioridade)}>
              {chamado.prioridade}
            </Etiqueta>
          </Metadado>
          <Metadado titulo="Situação">
            <Etiqueta classeCor={corPorStatus(chamado.status)}>
              {chamado.status}
            </Etiqueta>
          </Metadado>
          {chamado.atribuidoA && (
            <Metadado
              titulo="Atribuído a"
              icone={<UserCheck className="w-4 h-4" />}
            >
              {chamado.atribuidoA}
            </Metadado>
          )}
        </div>

        <div className="p-5 space-y-5">
          <section>
            <h3 className="text-sm font-semibold text-tinta mb-2">Descrição</h3>
            <p className="text-sm text-tinta whitespace-pre-wrap leading-relaxed">
              {chamado.descricao}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-tinta mb-2">Histórico</h3>
            {chamado.comentarios.length === 0 ? (
              <p className="text-sm italic text-tintaFraca">
                Nenhum comentário ainda.
              </p>
            ) : (
              <ul className="space-y-3">
                {chamado.comentarios.map((c) => (
                  <li
                    key={c.id}
                    className="border border-linha rounded-md p-3 bg-papel"
                  >
                    <div className="text-xs text-tintaFraca mb-1">
                      <span className="font-medium text-tinta">{c.autor}</span>
                      {" · "}
                      {c.criadoEm}
                    </div>
                    <p className="text-sm text-tinta">{c.texto}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="p-5 border-t border-linha bg-fundo/60">
          {concluido ? (
            <p className="text-sm text-emerald-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Chamado concluído.
            </p>
          ) : (
            <div className="space-y-3">
              <textarea
                placeholder="Escreva um comentário..."
                rows={2}
                value={textoComentario}
                onChange={(e) => setTextoComentario(e.target.value)}
                className="w-full px-3 py-2 border border-linha rounded-md text-sm bg-papel focus:outline-none focus:ring-2 focus:ring-marca/30 focus:border-marca resize-y"
              />
              <div className="flex flex-wrap gap-2 justify-between">
                <div className="flex gap-2">
                  {modoAgente && !chamado.atribuidoA && (
                    <Botao variante="secundario" onClick={aoAssumir}>
                      <UserCheck className="w-4 h-4" /> Assumir
                    </Botao>
                  )}
                  {modoAgente && (
                    <Botao variante="secundario" onClick={aoConcluir}>
                      <CheckCircle className="w-4 h-4" /> Concluir
                    </Botao>
                  )}
                </div>

                <Botao
                  variante="primario"
                  onClick={enviar}
                  disabled={!textoComentario.trim()}
                >
                  <Send className="w-4 h-4" /> Enviar
                </Botao>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Metadado({
  titulo,
  icone,
  children,
}: {
  titulo: string;
  icone?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs uppercase font-semibold text-tintaFraca mb-1">
        {titulo}
      </p>
      <div className="text-sm text-tinta flex items-center gap-1.5">
        {icone}
        {children}
      </div>
    </div>
  );
}
