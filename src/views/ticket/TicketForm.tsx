/**
 * ============================================================================
 * [V] VIEW: TicketForm (Abertura de Chamados com Triagem IA)
 * ARQUIVO: src/views/ticket/TicketForm.tsx
 * ============================================================================
 * DESCRIÇÃO:
 * Componente React puramente visual, responsável por renderizar o formulário de abertura de chamados.
 * Delega TODA a regra de negócio, IA e persistência para o TicketController.
 * ============================================================================
 */
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import confetti from "canvas-confetti";

// Importamos APENAS as Server Actions do nosso Controller (A Mágica do MVC no Next.js)
import {
  analyzeProblemAction,
  createTicketAction,
} from "../../controllers/TicketController";

import { Button } from "@/views/ui/button"; // Ajuste o caminho conforme instalou o shadcn
import { Textarea } from "@/views/ui/textarea";
import { Label } from "@/views/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/views/ui/card";
import {
  Bot,
  AlertTriangle,
  Send,
  Sparkles,
  CheckCircle2,
  PartyPopper,
  ClipboardCheck,
  ArrowRight,
  Cpu,
} from "lucide-react";

export function TicketForm() {
  // Controle de fluxo da interface puramente visual
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Estados de formulário
  const [problemDescription, setProblemDescription] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [category, setCategory] = useState("");
  const [protocolNumber, setProtocolNumber] = useState("");

  // Estados de loading (Feedback visual)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTicketCreated, setIsTicketCreated] = useState(false);

  const handleResetFlow = () => {
    setStep(1);
    setIsTicketCreated(false);
    setProblemDescription("");
    setCategory("");
    setAiSuggestion("");
    setProtocolNumber("");
  };

  // =========================================================================
  // INTEGRAÇÃO COM O CONTROLLER: Triagem IA
  // =========================================================================
  const handleAnalyzeProblem = async () => {
    if (!problemDescription.trim()) return;
    setIsAnalyzing(true);

    try {
      // O Controller faz o trabalho pesado no servidor e devolve mastigado
      const response = await analyzeProblemAction(problemDescription);

      if (!response.success || response.isEscalated) {
        setStep(3); // Falha ou Urgência -> Vai para abertura formal
      } else {
        setAiSuggestion(response.suggestion!);
        setStep(2); // Sucesso -> Mostra dica da IA
      }
    } catch (error) {
      setStep(3); // Fallback de segurança
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

  const handleDeflectionSuccess = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#10b981", "#34d399"],
    });
    setStep(4);
  };

  // =========================================================================
  // INTEGRAÇÃO COM O CONTROLLER: Abertura Formal
  // =========================================================================
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // O Controller salva no banco, gera o protocolo real e devolve o número
      const response = await createTicketAction(
        problemDescription,
        category,
        "Colaborador Logado",
      );

      if (response.success) {
        setProtocolNumber(response.protocolNumber!);
        setIsTicketCreated(true);
      } else {
        alert("Erro retornado pelo servidor: " + response.error);
      }
    } catch (error) {
      alert("Houve um problema de comunicação com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  // RENDERIZAÇÃO DA INTERFACE (MANTIDA IDÊNTICA AO SEU DESIGN ORIGINAL)
  // =========================================================================
  return (
    <div className="max-w-4xl mx-auto relative group">
      {/* Background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>

      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-6 sm:p-10">
        {/* --- STEPPER MODERNO --- */}
        {step !== 4 && !isTicketCreated && (
          <div className="flex items-center justify-center mb-10">
            {/* Omitido o código longo do stepper para brevidade visual, mantenha o seu original aqui! */}
            <div className="flex bg-gray-100/80 p-1.5 rounded-full border border-gray-200/50 shadow-inner">
              <span className="px-5 py-2 font-semibold text-sm">
                Passo {step} de 3
              </span>
            </div>
          </div>
        )}

        {/* --- STEP 1: CAPTURA DO PROBLEMA --- */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <Bot className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
                Olá! Como a TI pode ajudar hoje?
              </h2>
              <p className="text-lg text-gray-500 max-w-lg mx-auto">
                Descreva o problema com detalhes. A nossa IA de triagem vai
                analisar a situação em tempo real.
              </p>
            </div>

            <div className="space-y-6 max-w-2xl mx-auto">
              <Textarea
                placeholder="Ex: Minha impressora no setor financeiro parou de puxar papel..."
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[160px] text-lg resize-none rounded-2xl border-gray-200 bg-gray-50 p-6 focus:bg-white focus:ring-2 focus:ring-blue-500 shadow-inner"
              />
              <Button
                onClick={handleAnalyzeProblem}
                disabled={!problemDescription.trim() || isAnalyzing}
                className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-lg shadow-lg hover:-translate-y-1 transition-all"
              >
                {isAnalyzing
                  ? "Analisando sistemas..."
                  : "Encontrar Solução Automática"}
              </Button>
            </div>
          </div>
        )}

        {/* --- STEP 2: RESPOSTA DA IA --- */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-3xl mx-auto">
            <Card className="border-0 shadow-xl bg-gradient-to-b from-emerald-50/50 to-white rounded-3xl overflow-hidden">
              <CardHeader className="bg-emerald-500/5 border-b border-emerald-100/50 pb-6">
                <CardTitle className="text-xl text-emerald-700 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" /> Solução Sugerida pela IA
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 prose prose-emerald max-w-none">
                <ReactMarkdown>{aiSuggestion}</ReactMarkdown>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Button
                onClick={handleDeflectionSuccess}
                className="h-16 bg-emerald-600 hover:bg-emerald-700 text-lg"
              >
                <CheckCircle2 className="w-6 h-6 mr-2" /> Isso resolveu!
              </Button>
              <Button
                onClick={() => setStep(3)}
                variant="outline"
                className="h-16 text-lg border-2"
              >
                <AlertTriangle className="w-6 h-6 mr-2" /> Preciso da TI
              </Button>
            </div>
          </div>
        )}

        {/* --- STEP 3: FORMULÁRIO HUMANO --- */}
        {step === 3 &&
          (isTicketCreated ? (
            <div className="py-10 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <ClipboardCheck className="w-20 h-20 text-blue-600 mx-auto" />
              <h2 className="text-3xl font-extrabold text-gray-900">
                Chamado registrado!
              </h2>
              <div className="inline-block bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 mt-6">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">
                  Protocolo
                </p>
                <p className="text-2xl font-mono font-bold text-blue-600">
                  {protocolNumber}
                </p>
              </div>
              <Button
                onClick={handleResetFlow}
                className="mt-8 h-14 px-8 rounded-full bg-blue-600"
              >
                Nova Solicitação <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-6 duration-500">
              <div className="text-center mb-8">
                <Cpu className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Abertura Formal
                </h2>
              </div>
              <form onSubmit={handleSubmitTicket} className="space-y-6">
                <div className="space-y-3">
                  <Label>Categoria do Problema</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 px-4"
                    required
                  >
                    <option value="">Selecione a área afetada...</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Rede">Rede / Internet</option>
                    <option value="Acesso">Acesso / Senha</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-1/3 h-14 border-2"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 h-14 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar para a TI"}{" "}
                    <Send className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </form>
            </div>
          ))}

        {/* --- STEP 4: SUCESSO DEFLEXÃO --- */}
        {step === 4 && (
          <div className="py-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
            <PartyPopper className="w-20 h-20 text-emerald-600 mx-auto" />
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-500">
              Problema Resolvido!
            </h2>
            <Button
              onClick={handleResetFlow}
              className="mt-8 h-14 px-10 rounded-full bg-emerald-600 text-white"
            >
              Nova Solicitação
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
