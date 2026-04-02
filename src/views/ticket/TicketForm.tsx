/**
 * [V] VIEW: TicketForm (Formulario do Solicitante com Triagem IA)
 * ARQUIVO: src/views/ticket/TicketForm.tsx
 */
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { analyzeProblemAction, createTicketAction } from "@/controllers/TicketController";
import {
  Bot, AlertTriangle, Send, Sparkles, CheckCircle2,
  ClipboardCheck, ArrowRight, Cpu,
} from "lucide-react";

interface TicketFormProps {
  requesterName: string;
}

export function TicketForm({ requesterName }: TicketFormProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [problemDescription, setProblemDescription] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"incident" | "service_request">("incident");
  const [protocolNumber, setProtocolNumber] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTicketCreated, setIsTicketCreated] = useState(false);

  const handleResetFlow = () => {
    setStep(1);
    setIsTicketCreated(false);
    setProblemDescription("");
    setTitle("");
    setCategory("");
    setType("incident");
    setAiSuggestion("");
    setProtocolNumber("");
  };

  const handleAnalyzeProblem = async () => {
    if (!problemDescription.trim()) return;
    setIsAnalyzing(true);
    try {
      const response = await analyzeProblemAction(problemDescription);
      if (!response.success || response.isEscalated) {
        setStep(3);
      } else {
        setAiSuggestion(response.suggestion ?? "");
        setStep(2);
      }
    } catch {
      setStep(3);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (problemDescription.trim() && !isAnalyzing) handleAnalyzeProblem();
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await createTicketAction(
        title, problemDescription, category, type, requesterName,
      );
      if (response.success) {
        setProtocolNumber(response.protocolNumber ?? "");
        setIsTicketCreated(true);
      } else {
        alert("Erro: " + response.error);
      }
    } catch {
      alert("Falha na comunicacao com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sm:p-8">

      {/* STEP 1: Descricao do problema */}
      {step === 1 && (
        <div>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Como a TI pode te ajudar?
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Descreva seu problema. Nossa IA tentara resolver automaticamente.
            </p>
          </div>
          <div className="space-y-4 max-w-2xl mx-auto">
            <textarea
              placeholder="Ex: Minha impressora parou de funcionar..."
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full min-h-[140px] resize-none rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-4 text-base focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none transition-all dark:text-white dark:placeholder:text-slate-400"
            />
            <button
              onClick={handleAnalyzeProblem}
              disabled={!problemDescription.trim() || isAnalyzing}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <><Bot className="w-5 h-5 animate-pulse" /> Analisando...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Buscar Solucao Automatica</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Sugestao da IA */}
      {step === 2 && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl overflow-hidden">
            <div className="bg-emerald-100 dark:bg-emerald-900/40 p-4 flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
              <div>
                <h3 className="font-bold">Solucao Sugerida pela IA</h3>
                <p className="text-sm opacity-80">Tente os passos abaixo antes de abrir um chamado:</p>
              </div>
            </div>
            <div className="p-6 prose prose-emerald dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
              <ReactMarkdown>{aiSuggestion}</ReactMarkdown>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => { handleResetFlow(); setStep(4); }}
              className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" /> Resolveu meu problema!
            </button>
            <button
              onClick={() => setStep(3)}
              className="h-12 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition-all flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" /> Preciso da equipe de TI
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Formulario de abertura */}
      {step === 3 && !isTicketCreated && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Cpu className="w-7 h-7 text-slate-600 dark:text-slate-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Abertura de Chamado</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Preencha os dados para registrar formalmente.</p>
          </div>
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Titulo</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Resumo breve do problema"
                required
                className="mt-1 w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Descricao</label>
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                rows={3}
                required
                className="mt-1 w-full resize-none rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-4 text-sm focus:ring-2 focus:ring-blue-500/30 focus:outline-none dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="mt-1 w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500/30 focus:outline-none appearance-none cursor-pointer dark:text-white"
                >
                  <option value="">Selecione...</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Acesso">Acesso</option>
                  <option value="Rede">Rede</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tipo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "incident" | "service_request")}
                  className="mt-1 w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500/30 focus:outline-none appearance-none cursor-pointer dark:text-white"
                >
                  <option value="incident">Incidente</option>
                  <option value="service_request">Solicitacao de Servico</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 h-11 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? "Salvando..." : <><Send className="w-4 h-4" /> Enviar Chamado</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: Confirmacao de criacao */}
      {step === 3 && isTicketCreated && (
        <div className="py-8 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800 rounded-full flex items-center justify-center">
            <ClipboardCheck className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Chamado registrado!</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Acompanhe o andamento na sua lista de chamados.</p>
            <div className="inline-block bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-5 py-3 mt-4">
              <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Protocolo</p>
              <p className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">{protocolNumber}</p>
            </div>
          </div>
          <button
            onClick={handleResetFlow}
            className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all flex items-center gap-2"
          >
            Novo Chamado <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 4: Problema resolvido pela IA */}
      {step === 4 && (
        <div className="py-8 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">Problema Resolvido!</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">A equipe de TI agradece e segue a disposicao.</p>
          </div>
          <button
            onClick={handleResetFlow}
            className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all"
          >
            Nova Solicitacao
          </button>
        </div>
      )}
    </div>
  );
}
