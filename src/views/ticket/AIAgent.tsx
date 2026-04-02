/**
 * [V] VIEW: AIAgent (Chatbot Flutuante de Triagem)
 * ARQUIVO: src/views/ticket/AIAgent.tsx
 *
 * Toda comunicacao com a IA passa pelo Controller (Server Action).
 * A chave da API nunca e exposta ao navegador.
 */
"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { analyzeProblemAction } from "@/controllers/TicketController";

type Message = { id: number; role: "user" | "bot"; text: string };

const MENSAGEM_INICIAL: Message = {
  id: 1,
  role: "bot",
  text: "Ola! Sou a IA de triagem do SupportBox. Descreva seu problema e tentarei ajudar.",
};

export function AIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([MENSAGEM_INICIAL]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    try {
      const response = await analyzeProblemAction(input);
      let botText: string;
      if (!response.success) {
        botText = "Nao consegui analisar seu problema. Tente abrir um chamado diretamente.";
      } else if (response.isEscalated) {
        botText = "Sua situacao requer atendimento humano. Por favor, abra um chamado formal.";
      } else {
        botText = response.suggestion || "Sem solucao automatica. Recomendo abrir um chamado.";
      }
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "bot", text: botText }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: "Erro na comunicacao. Tente novamente." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all hover:scale-105 z-50"
          aria-label="Abrir assistente"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {isOpen && (
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
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Mensagens */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900 flex flex-col gap-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`p-2 rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center text-white ${msg.role === "user" ? "bg-slate-700" : "bg-blue-600"}`}>
                  {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[75%] p-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === "user"
                    ? "bg-slate-700 text-white rounded-tr-none"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
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
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Descreva o problema..."
              className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all dark:text-white"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
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
