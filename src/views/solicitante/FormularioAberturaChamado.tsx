/**
 * CAMADA: View — Formulário de Abertura de Chamado
 * ARQUIVO: src/views/solicitante/FormularioAberturaChamado.tsx
 *
 * RESPONSABILIDADE
 *   Coletar os dados de um novo chamado (título, descrição, categoria,
 *   tipo) e repassá-los ao chamador.
 *
 *   IMPORTANTE: o fluxo de "triagem por IA" presente na versão final
 *   do produto NÃO está aqui — ele faz parte da regra de negócio
 *   (Controller). Esta etapa apresenta apenas a abertura tradicional;
 *   o passo da IA será adicionado mais tarde, sem alterar o que
 *   este formulário renderiza.
 *
 * PRINCÍPIOS SOLID APLICADOS
 *   - SRP: coleta o formulário; nada além disso.
 *   - DIP: depende de `aoEnviar`, contrato externo.
 */
"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Botao } from "@/views/compartilhado/Botao";
import { CampoTexto } from "@/views/compartilhado/CampoTexto";
import { CampoTextoArea } from "@/views/compartilhado/CampoTextoArea";
import { CampoSelect } from "@/views/compartilhado/CampoSelect";
import {
  CATEGORIAS_DISPONIVEIS,
  type CategoriaChamado,
  type TipoChamado,
} from "@/views/compartilhado/tipos-view";

/** Pacote de dados que o formulário devolve ao ser enviado. */
export interface DadosNovoChamado {
  titulo: string;
  descricao: string;
  categoria: CategoriaChamado;
  tipo: TipoChamado;
}

interface PropsFormularioAberturaChamado {
  /** Disparado quando o usuário clica em "Enviar". */
  aoEnviar?: (dados: DadosNovoChamado) => void;
}

export function FormularioAberturaChamado({
  aoEnviar,
}: PropsFormularioAberturaChamado) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState<string>("");
  const [tipo, setTipo] = useState<TipoChamado>("incidente");

  /** O botão só fica disponível com todos os campos válidos. */
  const podeEnviar =
    titulo.trim().length > 0 &&
    descricao.trim().length > 0 &&
    CATEGORIAS_DISPONIVEIS.includes(categoria as CategoriaChamado);

  const submeter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!podeEnviar) return;
    aoEnviar?.({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      categoria: categoria as CategoriaChamado,
      tipo,
    });
    // A View se reseta após enviar — comportamento puramente visual.
    setTitulo("");
    setDescricao("");
    setCategoria("");
    setTipo("incidente");
  };

  return (
    <form
      onSubmit={submeter}
      className="bg-papel border border-linha rounded-md p-5 space-y-4"
    >
      <div>
        <h2 className="text-base font-semibold text-tinta">Abrir Chamado</h2>
        <p className="text-sm text-tintaFraca">
          Informe abaixo os detalhes do problema ou solicitação.
        </p>
      </div>

      <CampoTexto
        rotulo="Título"
        placeholder="Resumo curto do problema"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
      />

      <CampoTextoArea
        rotulo="Descrição"
        placeholder="Descreva o que aconteceu, com o máximo de detalhe possível."
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        rows={4}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CampoSelect
          rotulo="Categoria"
          opcoes={CATEGORIAS_DISPONIVEIS}
          textoPadrao="Selecione..."
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        />
        <CampoSelect
          rotulo="Tipo"
          opcoes={[
            { valor: "incidente", rotulo: "Incidente" },
            { valor: "solicitacao", rotulo: "Solicitação" },
          ]}
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoChamado)}
        />
      </div>

      <div className="flex justify-end">
        <Botao type="submit" disabled={!podeEnviar}>
          <Send className="w-4 h-4" /> Enviar
        </Botao>
      </div>
    </form>
  );
}
