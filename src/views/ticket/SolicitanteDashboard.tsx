/**
 * [V] VIEW: PainelSolicitante
 * ARQUIVO: src/views/ticket/SolicitanteDashboard.tsx
 *
 * Tela principal do solicitante: header, formulario de abertura,
 * lista dos seus chamados e chatbot flutuante.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Headphones, LogOut, RefreshCw, Clock, Loader2, Package, AlertTriangle } from "lucide-react";
import { acaoObterUsuarioAtual, acaoLogout } from "@/controllers/AuthController";
import { acaoObterMeusChamados } from "@/controllers/TicketController";
import { FormularioChamado } from "@/views/ticket/TicketForm";
import { ModalAgenteChamado } from "@/views/ticket/ticket-agent-modal";
import { AgenteIA } from "@/views/ticket/AIAgent";
import { obterCorStatus, formatarData } from "@/lib/ticket-utils";
import type { Chamado } from "@/models/types";

export function PainelSolicitante() {
  const router = useRouter();
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [protocoloSelecionado, setProtocoloSelecionado] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [saindo, setSaindo] = useState(false);

  const buscarUsuario = useCallback(async () => {
    const usuario = await acaoObterUsuarioAtual();
    if (!usuario) {
      router.push("/login");
      return;
    }
    setNomeUsuario(usuario.nome);
    return usuario.nome;
  }, [router]);

  const buscarChamados = useCallback(async (nome?: string) => {
    const solicitante = nome || nomeUsuario;
    if (!solicitante) return;
    setCarregando(true);
    try {
      const resultado = await acaoObterMeusChamados(solicitante);
      if (resultado.sucesso && resultado.chamados) setChamados(resultado.chamados);
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
    } finally {
      setCarregando(false);
    }
  }, [nomeUsuario]);

  useEffect(() => {
    buscarUsuario().then((nome) => {
      if (nome) buscarChamados(nome);
    });
  }, [buscarUsuario, buscarChamados]);

  const realizarLogout = async () => {
    setSaindo(true);
    await acaoLogout();
    router.push("/login");
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 p-2 rounded-xl text-orange-500">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">SupportBox</h1>
              <p className="text-xs text-slate-400">Portal do Solicitante</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-300 hidden sm:block">
              {nomeUsuario}
            </span>
            <button
              onClick={realizarLogout}
              disabled={saindo}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{saindo ? "Saindo..." : "Sair"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteudo */}
      <main className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Formulario de abertura */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Abrir Chamado</h2>
          <FormularioChamado nomeSolicitante={nomeUsuario} />
        </section>

        {/* Lista de chamados */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Meus Chamados</h2>
            <button
              onClick={() => buscarChamados()}
              disabled={carregando}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-orange-500 hover:border-orange-300 transition-colors disabled:opacity-50"
              title="Recarregar"
            >
              <RefreshCw className={`w-4 h-4 ${carregando ? "animate-spin" : ""}`} />
            </button>
          </div>

          {carregando ? (
            <div className="flex flex-col items-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-3" />
              <p className="text-slate-500 text-sm">Carregando seus chamados...</p>
            </div>
          ) : chamados.length === 0 ? (
            <div className="flex flex-col items-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <Package className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500">Voce ainda nao possui chamados.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {chamados.map((chamado) => (
                <div
                  key={chamado.id}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => { setProtocoloSelecionado(chamado.numero_protocolo); setModalAberto(true); }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3 items-start min-w-0">
                      {chamado.tipo === "incident"
                        ? <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        : <Package className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      }
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{chamado.titulo}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          <span className="font-mono font-medium text-slate-600 dark:text-slate-400">{chamado.numero_protocolo}</span>
                          {" \u2022 "}{chamado.categoria}
                        </p>
                      </div>
                    </div>
                    <span className={`${obterCorStatus(chamado.status)} text-white text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0`}>
                      {chamado.status}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-slate-400 gap-1.5 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <Clock className="w-3.5 h-3.5" />
                    {formatarData(chamado.criado_em)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal de detalhes (somente leitura + comentarios) */}
      <ModalAgenteChamado
        protocoloChamado={protocoloSelecionado}
        aberto={modalAberto}
        aoFechar={() => { setModalAberto(false); setProtocoloSelecionado(null); }}
        aoChamadoAtualizar={() => buscarChamados()}
        nomeUsuario={nomeUsuario}
        apenasLeitura
      />

      {/* Chatbot flutuante */}
      <AgenteIA />
    </>
  );
}
