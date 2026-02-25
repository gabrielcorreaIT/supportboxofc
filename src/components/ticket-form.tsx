/**
 * ============================================================================
 * COMPONENTE: TicketForm (Abertura de Chamados com Triagem IA - Nível 0)
 * ============================================================================
 * * 📝 RESUMO DO COMPONENTE:
 * Este é o componente central para a criação de novos chamados de TI pelos solicitantes.
 * Em vez de exibir um formulário estático tradicional, ele funciona como um "Assistente
 * de Triagem Inteligente" (Tier 0). Ele captura o problema do usuário e utiliza a IA
 * (Google Gemini) para tentar resolver a dor imediatamente antes de gerar um ticket
 * para a equipe humana (estratégia de Deflexão de Chamados).
 * * ⚙️ ARQUITETURA DE ESTADOS (STATE MACHINE):
 * O componente é um "Wizard" (formulário em múltiplas etapas) controlado pelo estado `step`:
 * - Step 1 (Diagnóstico): O usuário digita o problema relatado.
 * - Step 2 (Triagem IA): A IA analisa o texto e devolve um tutorial passo a passo. O usuário
 * pode aceitar a solução (vai para o Step 4) ou rejeitar (vai para o Step 3).
 * - Step 3 (Abertura Formal): O "Fallback". Se a IA não resolver (ou se for uma emergência),
 * o formulário técnico completo é exibido para o registro formal no banco de dados.
 * - Step 4 (Sucesso/Gamificação): Tela de comemoração exibida quando o usuário consegue
 * resolver o problema sozinho através da dica da IA.
 * * 🛠️ DEPENDÊNCIAS PRINCIPAIS:
 * - @google/generative-ai: Integração com a LLM (Gemini 2.5 Flash).
 * - react-markdown: Converte a resposta crua da IA em HTML formatado e legível.
 * - canvas-confetti: Efeito visual para gamificar a resolução de problemas (Step 4).
 * - tailwindcss & lucide-react: Estilização premium (Glassmorphism) e ícones da interface.
 * ============================================================================
 */

"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import confetti from "canvas-confetti";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Bot,
  AlertTriangle,
  Send,
  Sparkles,
  CheckCircle2,
  PartyPopper,
  ClipboardCheck,
  ArrowRight,
  Laptop,
  Cpu,
} from "lucide-react";

export default function TicketForm() {
  // Controle de fluxo da interface (1 a 4)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Dados preenchidos pelo usuário e respostas da IA
  const [problemDescription, setProblemDescription] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [category, setCategory] = useState("");

  // Estados de loading e transição de telas
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTicketCreated, setIsTicketCreated] = useState(false);

  // Reseta todo o formulário para o estado inicial
  const handleResetFlow = () => {
    setStep(1);
    setIsTicketCreated(false);
    setProblemDescription("");
    setCategory("");
    setAiSuggestion("");
  };

  // Envia a descrição do problema para o Google Gemini analisar
  const handleAnalyzeProblem = async () => {
    if (!problemDescription.trim()) return;
    setIsAnalyzing(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Chave API não configurada");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Cérebro da IA: Define as regras de atendimento do Nível 0
      const systemPrompt = `
        Você é o Agente Virtual de Triagem (Nível 0) do SupportBox, focado em ajudar 
        funcionários a resolverem problemas de TI sozinhos.
        REGRA 1: Se a mensagem contiver tom de urgência, responda APENAS com: ESCALAR_HUMANO.
        REGRA 2: Para problemas comuns, forneça uma solução didática. Use listas e negrito. Mantenha em no máximo 3 passos.
        Problema relatado: "${problemDescription}"
      `;

      const result = await model.generateContent(systemPrompt);
      const textResponse = result.response.text().trim();

      // Verifica se a IA solicitou transbordo para atendimento humano
      if (textResponse.includes("ESCALAR_HUMANO")) {
        setStep(3);
      } else {
        setAiSuggestion(textResponse);
        setStep(2);
      }
    } catch (error) {
      console.error("Erro na comunicação com a IA:", error);
      setStep(3); // Em caso de erro de rede, libera o formulário oficial como segurança
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Atalho de UX: Permite enviar o problema pressionando apenas a tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (problemDescription.trim() && !isAnalyzing) handleAnalyzeProblem();
    }
  };

  // Dispara a gamificação e vai para a tela final de sucesso (Deflexão concluída)
  const handleDeflectionSuccess = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#10b981", "#34d399"],
    });
    setStep(4);
  };

  // Envia o chamado formal para a equipe de TI (Simulação)
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsTicketCreated(true);
      setIsSubmitting(false);
    }, 1500);
  };

  // =========================================================================
  // RENDERIZAÇÃO DA INTERFACE (JSX)
  // =========================================================================
  return (
    <div className="max-w-4xl mx-auto relative group">
      {/* Efeito de brilho de fundo (Glow) usando as cores da marca */}
      <div className="absolute -inset-1 bg-gradient-to-r from-supportbox/20 to-emerald-500/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>

      {/* Container principal de vidro (Glassmorphism) */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-supportbox/5 border border-white p-6 sm:p-10">
        {/* --- STEPPER MODERNO (Indicador de Progresso visual) --- */}
        {step !== 4 && !isTicketCreated && (
          <div className="flex items-center justify-center mb-10">
            <div className="flex bg-gray-100/80 p-1.5 rounded-full border border-gray-200/50 shadow-inner">
              <div
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-500 flex items-center gap-2 ${step >= 1 ? "bg-white text-supportbox shadow-sm" : "text-gray-400"}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? "bg-supportbox/10" : "bg-gray-200"}`}
                >
                  1
                </div>
                Diagnóstico
              </div>
              <div
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-500 flex items-center gap-2 ${step >= 2 ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400"}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? "bg-emerald-50" : "bg-gray-200"}`}
                >
                  2
                </div>
                Triagem IA
              </div>
              <div
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-500 flex items-center gap-2 ${step === 3 ? "bg-white text-supportbox shadow-sm" : "text-gray-400"}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 3 ? "bg-supportbox/10" : "bg-gray-200"}`}
                >
                  3
                </div>
                Abertura
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 1: CAPTURA DO PROBLEMA (DIAGNÓSTICO) --- */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-supportbox/10 to-supportbox/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <Bot className="w-10 h-10 text-supportbox" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
                Olá! Como a TI pode te ajudar hoje?
              </h2>
              <p className="text-lg text-gray-500 max-w-lg mx-auto">
                Descreva seu problema com detalhes. Nossa IA de atendimento vai
                analisar sua situação em tempo real.
              </p>
            </div>

            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="relative group/textarea">
                <Textarea
                  placeholder="Ex: Minha impressora no setor financeiro parou de puxar papel..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[160px] text-lg resize-none rounded-2xl border-gray-200 bg-gray-50/50 p-6 focus:bg-white focus:ring-4 focus:ring-supportbox/10 focus:border-supportbox transition-all shadow-inner placeholder:text-gray-400"
                />
                <div className="absolute bottom-4 right-4 text-xs font-medium text-gray-400 bg-white/80 px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none">
                  Pressione{" "}
                  <kbd className="font-sans border border-gray-200 rounded px-1.5 py-0.5 mx-0.5 bg-gray-50">
                    Enter
                  </kbd>{" "}
                  para enviar
                </div>
              </div>

              <Button
                onClick={handleAnalyzeProblem}
                disabled={!problemDescription.trim() || isAnalyzing}
                className="w-full h-16 rounded-2xl bg-supportbox hover:bg-supportbox-dark text-lg shadow-lg hover:shadow-supportbox/25 transition-all hover:-translate-y-1"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2 font-medium">
                    <Bot className="w-6 h-6 animate-pulse" /> Analisando
                    sistemas
                    <span className="flex items-center gap-1 ml-1 translate-y-1">
                      <span
                        className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2 font-semibold tracking-wide">
                    <Sparkles className="w-6 h-6" /> Encontrar Solução
                    Automática
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* --- STEP 2: RESPOSTA DA IA (TENTATIVA DE DEFLEXÃO) --- */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-3xl mx-auto">
            <Card className="border-0 shadow-xl shadow-emerald-500/10 bg-gradient-to-b from-emerald-50/50 to-white rounded-3xl overflow-hidden">
              <CardHeader className="bg-emerald-500/5 border-b border-emerald-100/50 pb-6">
                <div className="flex items-center gap-3 text-emerald-700">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      Solução Sugerida pela IA
                    </CardTitle>
                    <CardDescription className="text-emerald-600/80 mt-1">
                      Siga os passos abaixo antes de acionar um técnico humano:
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose prose-lg prose-emerald max-w-none text-gray-700 font-medium leading-relaxed prose-strong:text-emerald-800 prose-ol:list-decimal prose-ol:pl-4 prose-li:my-3">
                  <ReactMarkdown>{aiSuggestion}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Button
                onClick={handleDeflectionSuccess}
                className="h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-lg shadow-lg hover:shadow-emerald-600/25 transition-all hover:-translate-y-1"
              >
                <CheckCircle2 className="w-6 h-6 mr-2" /> Isso resolveu o
                problema!
              </Button>
              <Button
                onClick={() => setStep(3)}
                variant="outline"
                className="h-16 rounded-2xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 text-lg transition-all"
              >
                <AlertTriangle className="w-6 h-6 mr-2" /> Preciso da equipe de
                TI
              </Button>
            </div>
          </div>
        )}

        {/* --- STEP 3: FORMULÁRIO TÉCNICO E TELA DE PROTOCOLO --- */}
        {step === 3 &&
          (isTicketCreated ? (
            <div className="py-10 flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="relative">
                <div className="absolute inset-0 bg-supportbox/20 rounded-full blur-xl animate-pulse"></div>
                <div className="w-28 h-28 bg-gradient-to-br from-supportbox/10 to-supportbox/5 border-4 border-white shadow-xl rounded-full flex items-center justify-center relative z-10">
                  <ClipboardCheck className="w-14 h-14 text-supportbox" />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Chamado registrado!
                </h2>
                <p className="text-lg text-gray-500 max-w-md mx-auto">
                  Sua solicitação já está no painel da nossa equipe técnica.
                </p>

                <div className="inline-block bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 mt-6 shadow-inner">
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">
                    Protocolo de Atendimento
                  </p>
                  <p className="text-2xl font-mono font-bold text-supportbox">
                    #REQ-{Math.floor(Math.random() * 10000)}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleResetFlow}
                className="mt-8 h-14 px-8 rounded-full bg-supportbox hover:bg-supportbox-dark text-white text-lg shadow-md transition-all hover:-translate-y-1"
              >
                Voltar ao Início <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-6 duration-500">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200">
                  <Cpu className="w-8 h-8 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Abertura Formal
                </h2>
                <p className="text-gray-500 mt-2">
                  A triagem automática não resolveu. Detalhe para a equipe
                  técnica.
                </p>
              </div>

              <Card className="border border-gray-100 shadow-xl shadow-gray-200/40 rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmitTicket} className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-base font-semibold text-gray-700">
                        Descrição do Incidente
                      </Label>
                      <Textarea
                        value={problemDescription}
                        onChange={(e) => setProblemDescription(e.target.value)}
                        className="min-h-[120px] rounded-2xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-supportbox text-base p-4"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base font-semibold text-gray-700">
                        Categoria do Problema
                      </Label>
                      <div className="relative">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-base focus:bg-white focus:ring-2 focus:ring-supportbox focus:border-supportbox appearance-none cursor-pointer"
                          required
                        >
                          <option value="">Selecione a área afetada...</option>
                          <option value="hardware">
                            Hardware (Equipamento físico quebrado)
                          </option>
                          <option value="software">
                            Software (Sistema, falhas, travamentos)
                          </option>
                          <option value="acesso">
                            Acesso (Senhas, Permissões, E-mail)
                          </option>
                          <option value="rede">
                            Rede / Internet (Conexão, Wi-Fi)
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="w-1/3 h-14 rounded-xl border-2 border-gray-200 text-gray-600 text-base hover:bg-gray-50"
                      >
                        Voltar
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-2/3 h-14 rounded-xl bg-supportbox hover:bg-supportbox-dark text-white text-base shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                      >
                        {isSubmitting
                          ? "Registrando na Fila..."
                          : "Enviar para a TI"}
                        {!isSubmitting && <Send className="w-5 h-5 ml-2" />}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          ))}

        {/* --- STEP 4: TELA DE SUCESSO DA DEFLEXÃO (GAMIFICAÇÃO) --- */}
        {step === 4 && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="w-28 h-28 bg-gradient-to-br from-emerald-100 to-emerald-50 border-4 border-white shadow-xl rounded-full flex items-center justify-center relative z-10">
                <PartyPopper className="w-14 h-14 text-emerald-600" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-500 tracking-tight">
                Problema Resolvido!
              </h2>
              <p className="text-xl text-gray-600 max-w-md mx-auto font-medium">
                Que ótimo! Você resolveu tudo rapidamente.
              </p>
              <p className="text-base text-gray-400 mt-2">
                A equipe de TI agradece a sua colaboração e segue a disposição.
              </p>
            </div>

            <Button
              onClick={handleResetFlow}
              className="mt-8 h-14 px-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg shadow-lg hover:shadow-emerald-600/30 transition-all hover:-translate-y-1"
            >
              Nova Solicitação
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
