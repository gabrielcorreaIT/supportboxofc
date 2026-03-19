/**
 * ============================================================================
 * COMPONENTE: AIAgent (Assistente Virtual de Triagem)
 * PROJETO: SupportBox
 * ============================================================================
 * * DESCRIÇÃO:
 * Este componente renderiza a interface do chat de suporte (botão flutuante e janela)
 * e gerencia a comunicação direta com a API do Google Gemini (usando o modelo gemini-2.5-flash).
 * * * ARQUITETURA E SEGURANÇA (NOTA PARA A EQUIPE):
 * Como este é um projeto 100% front-end (sem banco de dados ou servidor Node.js backend),
 * a integração com a IA está sendo feita diretamente pelo navegador (Client-Side).
 * Por isso, a chave de API precisa do prefixo 'NEXT_PUBLIC_' no arquivo .env.local.
 * Em um cenário de produção corporativo, essa chamada seria movida para uma
 * rota de backend para ocultar a chave de API do usuário final.
 */

"use client"; // Indica ao Next.js que este componente usa interatividade (React Hooks) no navegador

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
// Importação oficial do SDK do Google Generative AI para uso no front-end
import { GoogleGenerativeAI } from "@google/generative-ai";
// Importação do hook do Next.js para ler a URL atual
import { usePathname } from "next/navigation";

/**
 * Interface que define o formato exato de cada balão de mensagem no chat.
 */
type Message = {
  id: number;
  role: "user" | "bot"; // Diferencia quem enviou a mensagem para alinhar na direita ou esquerda
  text: string;
};

export function AIAgent() {
  // =========================================================================
  // 1. LÓGICA DE VISIBILIDADE (ROTEAMENTO)
  // =========================================================================
  const pathname = usePathname(); // Descobre qual é a URL atual do navegador

  // =========================================================================
  // 2. ESTADOS DO COMPONENTE (React State)
  // =========================================================================

  const [isOpen, setIsOpen] = useState(false); // Controla a visibilidade da janela do chat
  const [input, setInput] = useState(""); // Armazena o texto atual da barra de digitação
  const [isTyping, setIsTyping] = useState(false); // Ativa/desativa a animação de "digitando..." da IA

  // Histórico de mensagens. Começa com uma mensagem inicial fixa do robô.
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      text: "Olá! Sou a IA de triagem do SupportBox. Descreva o seu problema de forma breve para que eu tente ajudar antes de abrirmos um chamado.",
    },
  ]);

  // =========================================================================
  // 3. CONTROLE DE INTERFACE (Auto-Scroll)
  // =========================================================================

  // Referência invisível que fica no final da lista de mensagens para ancorar a rolagem
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Função que rola a tela suavemente até a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Toda vez que a lista de mensagens mudar ou o bot começar a digitar, a tela rola para baixo
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // =========================================================================
  // 4. INTEGRAÇÃO COM A INTELIGÊNCIA ARTIFICIAL (Gemini API)
  // =========================================================================

  /**
   * handleSend: Função principal disparada quando o usuário envia uma mensagem.
   * Ela atualiza a interface imediatamente e faz a requisição assíncrona para o Google.
   */
  const handleSend = async () => {
    // 1. Validação: Impede o envio de mensagens vazias ou só com espaços
    if (!input.trim()) return;

    // 2. Atualização Otimista da UI: Mostra a mensagem do usuário na tela instantaneamente
    const newUserMsg: Message = { id: Date.now(), role: "user", text: input };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput(""); // Limpa a barra de digitação
    setIsTyping(true); // Liga os "três pontinhos" do bot

    try {
      // 3. Recupera a chave de API liberada para o front-end
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error(
          "Chave de API do Gemini não encontrada no arquivo .env.local!",
        );
      }

      // 4. Instancia o cliente do Google e define o modelo de IA atualizado (gemini-2.5-flash)
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // 5. Engenharia de Prompt: Define a "personalidade" da IA e o contexto do sistema
      const prompt = `Você é o assistente virtual de triagem do sistema SupportBox. 
      O SupportBox é um sistema de help desk (chamados de TI).
      Seja amigável, educado e extremamente breve. 
      Se o usuário relatar um problema comum (senha, impressora, internet), dê uma dica rápida de como resolver. 
      Se for um problema complexo, diga para ele abrir um chamado no sistema.
      
      Mensagem do usuário: "${newUserMsg.text}"`;

      // 6. Faz a requisição para a nuvem do Google (aguarda a resposta gerar)
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // 7. Atualiza o chat adicionando o balão de resposta da IA
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: responseText },
      ]);
    } catch (error) {
      // 8. Tratamento de Erros: Cai aqui se a internet falhar, a API key estiver errada, etc.
      console.error("🔴 Erro detalhado da IA:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: "Ops, ocorreu um erro na comunicação com a IA. Verifique se a chave de API está configurada corretamente.",
        },
      ]);
    } finally {
      // 9. Finalização: Desliga a animação de "digitando", independente de sucesso ou falha
      setIsTyping(false);
    }
  };

  // =========================================================================
  // 5. TRAVA DE EXIBIÇÃO E RENDERIZAÇÃO DA INTERFACE
  // =========================================================================

  // Se a pessoa estiver na tela de administração (Agente de TI), o robô não renderiza nada!
  if (pathname?.includes("/agente")) {
    return null;
  }

  return (
    <>
      {/* --- BOTÃO FLUTUANTE --- */}
      {/* Fica oculto ('hidden') quando o chat está aberto */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-supportbox text-white shadow-lg hover:brightness-90 transition-transform hover:scale-105 ${isOpen ? "hidden" : "flex"}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* --- JANELA PRINCIPAL DO CHAT --- */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">
          {/* Cabeçalho */}
          <div className="bg-supportbox p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-semibold">Agente de IA</span>
            </div>
            {/* Botão Fechar (X) */}
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Área Principal: Lista de Mensagens (com rolagem) */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg) => (
              // Alterna o layout (flex-row-reverse para usuário, flex-row para bot)
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Ícone de Avatar */}
                <div
                  className={`p-2 rounded-full h-8 w-8 flex items-center justify-center text-white ${msg.role === "user" ? "bg-slate-700" : "bg-supportbox"}`}
                >
                  {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Balão de Texto (whitespace-pre-wrap permite quebras de linha enviadas pela IA) */}
                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-slate-700 text-white rounded-tr-none" : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Animação "Digitando..." (3 pontinhos piscantes) */}
            {isTyping && (
              <div className="flex gap-2 flex-row">
                <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center text-white bg-supportbox">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}

            {/* Âncora invisível para o auto-scroll funcionar */}
            <div ref={messagesEndRef} />
          </div>

          {/* Rodapé: Input de texto e botão de enviar */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()} // Envia com a tecla Enter
              placeholder="Descreva o problema..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-supportbox/50"
            />
            {/* O botão é desativado se o input estiver vazio ou se a IA estiver processando uma resposta */}
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-2 bg-supportbox text-white rounded-lg hover:brightness-90 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
