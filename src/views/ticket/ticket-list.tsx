/**
 * CAMADA: View — Lista de Chamados (Painel do Agente)
 * ARQUIVO: src/views/ticket/ticket-list.tsx
 *
 * DESCRICAO:
 *   Exibe a lista de todos os chamados do sistema com filtros por
 *   status e busca por texto. Cada chamado pode ser clicado para
 *   abrir o modal de detalhes (ticket-agent-modal).
 *
 *   Esta e a view principal do dashboard do agente de TI.
 *
 * CONEXOES:
 *   - Depende de: TicketController.acaoObterDadosPainel (lista + metricas),
 *                 ticket-agent-modal (detalhes), ticket-utils (cores/datas)
 *   - Usado por:  src/app/(dashboard)/agente/page.tsx
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { acaoObterDadosPainel } from "@/controllers/TicketController";
import { ModalAgenteChamado } from "@/views/ticket/ticket-agent-modal";
import type { Chamado } from "@/models/types";
import { obterCorStatus, obterCorPrioridade, formatarData } from "@/lib/ticket-utils";
import { Clock, Package, Search, AlertTriangle, Loader2, RefreshCw } from "lucide-react";

/** Opcoes de filtro por status. */
type FiltroStatus = "todos" | "abertos" | "em-andamento" | "concluidos";

export default function ListaChamados() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todos");

  // Estado do modal de detalhes
  const [protocoloSelecionado, setProtocoloSelecionado] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  /** Busca todos os chamados via Controller. */
  const buscarChamados = useCallback(async () => {
    setCarregando(true);
    try {
      const resultado = await acaoObterDadosPainel();
      if (resultado.sucesso && resultado.dados) setChamados(resultado.dados.chamados);
    } catch (error) {
      console.error("Erro ao carregar chamados:", error);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { buscarChamados(); }, [buscarChamados]);

  // Aplica filtros de busca e status sobre a lista de chamados
  const chamadosFiltrados = chamados.filter((chamado) => {
    const texto = `${chamado.titulo} ${chamado.numero_protocolo} ${chamado.solicitante}`.toLowerCase();
    const correspondeAoBuscar = texto.includes(termoBusca.toLowerCase());

    let correspondeAoStatus = filtroStatus === "todos";
    if (filtroStatus === "abertos" && chamado.status === "Aberto") correspondeAoStatus = true;
    if (filtroStatus === "em-andamento" && chamado.status === "Em Andamento") correspondeAoStatus = true;
    if (filtroStatus === "concluidos" && chamado.status === "Concluído") correspondeAoStatus = true;

    return correspondeAoBuscar && correspondeAoStatus;
  });

  /** Configuracao das abas de filtro por status. */
  const abasStatus: { valor: FiltroStatus; rotulo: string }[] = [
    { valor: "todos", rotulo: "Todos" },
    { valor: "abertos", rotulo: "Abertos" },
    { valor: "em-andamento", rotulo: "Em Andamento" },
    { valor: "concluidos", rotulo: "Concluidos" },
  ];

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* FILTROS: busca por texto e abas de status                    */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Pesquisar chamados..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="w-full sm:w-[300px] pl-9 pr-4 h-10 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
            {abasStatus.map(({ valor, rotulo }) => (
              <button
                key={valor}
                onClick={() => setFiltroStatus(valor)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filtroStatus === valor
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {rotulo}
              </button>
            ))}
          </div>
          <button
            onClick={buscarChamados}
            disabled={carregando}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-orange-500 hover:border-orange-300 transition-colors disabled:opacity-50"
            title="Recarregar"
          >
            <RefreshCw className={`w-4 h-4 ${carregando ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* LISTA DE CHAMADOS (ou estados de carregamento/vazio)         */}
      {/* ============================================================ */}
      {carregando ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-3" />
          <p className="text-slate-500 font-medium text-sm">Carregando chamados...</p>
        </div>
      ) : chamadosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
          <Package className="h-10 w-10 text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">Nenhum chamado encontrado.</p>
          {termoBusca && (
            <button onClick={() => setTermoBusca("")} className="mt-2 text-sm text-orange-500 hover:underline">
              Limpar busca
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {chamadosFiltrados.map((chamado) => (
            <div
              key={chamado.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3 items-start min-w-0">
                  {/* Icone: triangulo para incidente, caixa para solicitacao */}
                  {chamado.tipo === "incident"
                    ? <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    : <Package className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  }
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{chamado.titulo}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      <span className="font-mono font-medium text-slate-700">{chamado.numero_protocolo}</span>
                      {" \u2022 "}{chamado.solicitante}{" \u2022 "}{chamado.categoria}
                      {chamado.atribuido_a && <span className="text-orange-500"> {"\u2022"} {chamado.atribuido_a}</span>}
                    </p>
                  </div>
                </div>
                {/* Badges de prioridade e status */}
                <div className="flex gap-2 flex-shrink-0">
                  <span className={`${obterCorPrioridade(chamado.prioridade)} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
                    {chamado.prioridade}
                  </span>
                  <span className={`${obterCorStatus(chamado.status)} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
                    {chamado.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center text-xs text-slate-400 gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatarData(chamado.criado_em)}
                </div>
                <button
                  onClick={() => { setProtocoloSelecionado(chamado.numero_protocolo); setModalAberto(true); }}
                  className="text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline transition-colors"
                >
                  Ver detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalhes do chamado */}
      <ModalAgenteChamado
        protocoloChamado={protocoloSelecionado}
        aberto={modalAberto}
        aoFechar={() => { setModalAberto(false); setProtocoloSelecionado(null); }}
        aoChamadoAtualizar={buscarChamados}
      />
    </div>
  );
}
