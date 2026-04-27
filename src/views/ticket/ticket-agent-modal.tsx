/**
 * CAMADA: View — Modal de Detalhes do Chamado
 * ARQUIVO: src/views/ticket/ticket-agent-modal.tsx
 *
 * DESCRICAO:
 *   Modal (janela sobreposta) que exibe todos os detalhes de um chamado:
 *   informacoes gerais, descricao completa, historico de comentarios e
 *   acoes disponiveis.
 *
 *   Funciona em dois modos:
 *     - AGENTE (padrao):       pode assumir chamado, concluir e comentar
 *     - SOMENTE LEITURA:       pode apenas visualizar e comentar
 *       (prop apenasLeitura)   (usado pelo solicitante)
 *
 * CONEXOES:
 *   - Depende de: TicketController (detalhes, comentarios, status, atribuicao),
 *                 ticket-utils (cores e formatacao), types.ts
 *   - Usado por:  ticket-list (painel do agente), SolicitanteDashboard
 */
"use client";

import { useState, useEffect } from "react";
import { Clock, MessageSquare, User, Send, CheckCircle, Loader2, X, Tag, UserCheck } from "lucide-react";
import {
  acaoObterDetalhesChamado,
  acaoAdicionarComentario,
  acaoAtualizarStatus,
  acaoAtribuirChamado,
} from "@/controllers/TicketController";
import type { Chamado, Comentario } from "@/models/types";
import { obterCorStatus, obterInsigniaPrioridade, formatarData } from "@/lib/ticket-utils";

interface PropsModalAgente {
  protocoloChamado: string | null; // Protocolo do chamado a exibir (null = nenhum)
  aberto: boolean;                 // Controla visibilidade do modal
  aoFechar: () => void;            // Callback quando o usuario fecha o modal
  aoChamadoAtualizar?: () => void; // Callback para a tela pai recarregar a lista
  nomeUsuario?: string;            // Nome do usuario logado (para autoria de comentarios)
  apenasLeitura?: boolean;         // Se true, esconde botoes de acao do agente
}

/** Chamado com seu historico de comentarios anexado. */
type ChamadoComInteracoes = Chamado & { interacoes: Comentario[] };

export function ModalAgenteChamado({
  protocoloChamado,
  aberto,
  aoFechar,
  aoChamadoAtualizar,
  nomeUsuario = "Equipe de TI",
  apenasLeitura = false,
}: PropsModalAgente) {
  const [chamado, setChamado] = useState<ChamadoComInteracoes | null>(null);
  const [novoComentario, setNovoComentario] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [resolvendo, setResolvendo] = useState(false);
  const [atribuindo, setAtribuindo] = useState(false);

  // Carrega os detalhes do chamado quando o modal abre
  useEffect(() => {
    if (!protocoloChamado || !aberto) return;
    setCarregando(true);
    setChamado(null);
    acaoObterDetalhesChamado(protocoloChamado).then((resultado) => {
      if (resultado.sucesso && resultado.dados) setChamado(resultado.dados as ChamadoComInteracoes);
      setCarregando(false);
    });
  }, [protocoloChamado, aberto]);

  /** Recarrega os dados do chamado e notifica a tela pai. */
  const atualizar = async () => {
    if (!protocoloChamado) return;
    const resultado = await acaoObterDetalhesChamado(protocoloChamado);
    if (resultado.sucesso && resultado.dados) setChamado(resultado.dados as ChamadoComInteracoes);
    aoChamadoAtualizar?.();
  };

  /** Envia um novo comentario ao historico do chamado. */
  const enviarComentario = async () => {
    if (!novoComentario.trim() || !chamado) return;
    setEnviando(true);
    const resultado = await acaoAdicionarComentario(chamado.id, nomeUsuario, novoComentario);
    if (resultado.sucesso) { setNovoComentario(""); await atualizar(); }
    setEnviando(false);
  };

  /** Agente assume a responsabilidade pelo chamado. */
  const assumirChamado = async () => {
    if (!chamado) return;
    setAtribuindo(true);
    await acaoAtribuirChamado(chamado.id, nomeUsuario);
    await acaoAdicionarComentario(chamado.id, "Sistema", `Chamado assumido por ${nomeUsuario}.`);
    await atualizar();
    setAtribuindo(false);
  };

  /** Agente marca o chamado como concluido. */
  const resolverChamado = async () => {
    if (!chamado) return;
    setResolvendo(true);
    await acaoAtualizarStatus(chamado.id, "Concluído");
    await acaoAdicionarComentario(chamado.id, "Sistema", `Chamado encerrado por ${nomeUsuario}.`);
    await atualizar();
    setResolvendo(false);
  };

  if (!aberto) return null;

  const estaConcluido = chamado?.status === "Concluído";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && aoFechar()}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col">
        {/* Estado de carregamento */}
        {carregando || !chamado ? (
          <div className="flex flex-col items-center justify-center p-16">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-4" />
            <p className="text-slate-500 font-medium">Carregando...</p>
          </div>
        ) : (
          <>
            {/* ====================================================== */}
            {/* CABECALHO: protocolo, titulo, status e dados gerais     */}
            {/* ====================================================== */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div className="min-w-0 mr-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-orange-600 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-full px-2.5 py-1 mb-2">
                    <Tag className="w-3 h-3" />{chamado.numero_protocolo}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{chamado.titulo}</h2>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`${obterCorStatus(chamado.status)} text-white text-xs font-semibold px-3 py-1.5 rounded-full`}>
                    {chamado.status}
                  </span>
                  <button onClick={aoFechar} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Grade de informacoes do chamado */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Solicitante</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                    <User className="w-4 h-4 text-orange-500" />{chamado.solicitante}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Abertura</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-orange-500" />{formatarData(chamado.criado_em)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Categoria</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{chamado.categoria}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Prioridade</p>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${obterInsigniaPrioridade(chamado.prioridade)}`}>
                    {chamado.prioridade}
                  </span>
                </div>
                {chamado.atribuido_a && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Tecnico Responsavel</p>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4" />{chamado.atribuido_a}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ====================================================== */}
            {/* CORPO: descricao e historico de comentarios             */}
            {/* ====================================================== */}
            <div className="p-6 space-y-6 flex-1">
              {/* Descricao completa do problema */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Descricao</h3>
                <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-4 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  {chamado.descricao}
                </div>
              </div>

              <hr className="border-slate-100 dark:border-slate-700" />

              {/* Historico de comentarios */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-orange-500" />
                  Historico
                  {chamado.interacoes.length > 0 && (
                    <span className="ml-auto text-xs text-slate-400">{chamado.interacoes.length} mensagem(s)</span>
                  )}
                </h3>

                {chamado.interacoes.length === 0 ? (
                  <div className="text-center p-6 border border-dashed border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <p className="text-sm text-slate-400 italic">Nenhum comentario ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                    {chamado.interacoes.map((msg) => {
                      const ehProprio = msg.autor === nomeUsuario || msg.autor === "Equipe de TI";
                      const ehSistema = msg.autor === "Sistema" || msg.autor === "Sistema Automatico";
                      return (
                        <div key={msg.id ?? `${msg.criado_em}-${msg.autor}`} className={`flex flex-col ${ehProprio ? "items-end" : "items-start"}`}>
                          <div className="text-xs text-slate-400 mb-1 mx-1">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">{msg.autor}</span> {"\u2022"} {formatarData(msg.criado_em ?? "")}
                          </div>
                          <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                            ehProprio ? "bg-orange-500 text-white rounded-tr-sm"
                            : ehSistema ? "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 italic rounded-tl-sm border border-slate-200 dark:border-slate-600"
                            : "bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                          }`}>{msg.texto}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ====================================================== */}
            {/* RODAPE: area de acoes (comentar, assumir, concluir)     */}
            {/* ====================================================== */}
            <div className="p-6 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700 rounded-b-2xl">
              {estaConcluido ? (
                <div className="flex flex-col items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
                  <CheckCircle className="w-6 h-6" />
                  <p className="font-semibold text-sm">Chamado concluido.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Campo de comentario */}
                  <textarea
                    placeholder="Escreva um comentario..."
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    disabled={enviando || resolvendo}
                    rows={2}
                    className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all disabled:opacity-50 dark:text-white"
                  />
                  <div className="flex justify-between items-center gap-3">
                    {/* Botoes de acao do agente (escondidos no modo somente leitura) */}
                    {!apenasLeitura && (
                      <div className="flex gap-2">
                        {!chamado.atribuido_a && (
                          <button
                            onClick={assumirChamado}
                            disabled={atribuindo || enviando}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-orange-500 text-orange-600 font-semibold text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors disabled:opacity-50"
                          >
                            {atribuindo ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                            Assumir
                          </button>
                        )}
                        <button
                          onClick={resolverChamado}
                          disabled={resolvendo || enviando}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-green-500 text-green-600 font-semibold text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-50"
                        >
                          {resolvendo ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          Concluir
                        </button>
                      </div>
                    )}
                    {/* Botao de enviar comentario */}
                    <div className="flex gap-2 ml-auto">
                      <button
                        onClick={enviarComentario}
                        disabled={!novoComentario.trim() || enviando || resolvendo}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
