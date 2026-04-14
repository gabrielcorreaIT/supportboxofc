/**
 * [V] VIEW: AgenteIA (Chatbot Flutuante de Triagem)
 * ARQUIVO: src/views/ticket/AIAgent.tsx
 *
 * Toda comunicacao com a IA passa pelo Controller (Server Action).
 * A chave da API nunca e exposta ao navegador.
 */
"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { acaoAnalisarProblema } from "@/controllers/TicketController";

type Mensagem = { id: number; papel: "usuario" | "assistente"; texto: string };

const MENSAGEM_INICIAL: Mensagem = {
  id: 1,
  papel: "assistente",
  texto: "Ola! Sou a IA de triagem do SupportBox. Descreva seu problema e tentarei ajudar.",
};

export function AgenteIA() {
  const [aberto, setAberto] = useState(false);
  const [entrada, setEntrada] = useState("");
  const [digitando, setDigitando] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([MENSAGEM_INICIAL]);
  const fimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, digitando]);

  const enviar = async () => {
    if (!entrada.trim()) return;
    const msgUsuario: Mensagem = { id: Date.now(), papel: "usuario", texto: entrada };
    setMensagens((prev) => [...prev, msgUsuario]);
    setEntrada("");
    setDigitando(true);
    try {
      const resposta = await acaoAnalisarProblema(entrada);
      let textoResposta: string;
      if (!resposta.sucesso) {
        textoResposta = "Nao consegui analisar seu problema. Tente abrir um chamado diretamente.";
      } else if (resposta.escalado) {
        textoResposta = "Sua situacao requer atendimento humano. Por favor, abra um chamado formal.";
      } else {
        textoResposta = resposta.sugestao || "Sem solucao automatica. Recomendo abrir um chamado.";
      }
      setMensagens((prev) => [...prev, { id: Date.now() + 1, papel: "assistente", texto: textoResposta }]);
    } catch {
      setMensagens((prev) => [
        ...prev,
        { id: Date.now() + 1, papel: "assistente", texto: "Erro na comunicacao. Tente novamente." },
      ]);
    } finally {
      setDigitando(false);
    }
  };

  return (
    <>
      {!aberto && (
        <button
          onClick={() => setAberto(true)}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all hover:scale-105 z-50"
          aria-label="Abrir assistente"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {aberto && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">
          {/* Cabecalho */}
          <div className="bg-blue-600 p-4 flex justify-between items-center text-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <div>
                <span className="font-semibold text-sm">Agente de Triagem</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-xs text-blue-200">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setAberto(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Mensagens */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900 flex flex-col gap-3">
            {mensagens.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.papel === "usuario" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`p-2 rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center text-white ${msg.papel === "usuario" ? "bg-slate-700" : "bg-blue-600"}`}>
                  {msg.papel === "usuario" ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[75%] p-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.papel === "usuario"
                    ? "bg-slate-700 text-white rounded-tr-none"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none"
                }`}>
                  {msg.texto}
                </div>
              </div>
            ))}
            {digitando && (
              <div className="flex gap-2">
                <div className="p-2 rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center text-white bg-blue-600">
                  <Bot size={16} />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={fimRef} />
          </div>

          {/* Entrada */}
          <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && enviar()}
              placeholder="Descreva o problema..."
              className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all dark:text-white"
            />
            <button
              onClick={enviar}
              disabled={!entrada.trim() || digitando}
              className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
