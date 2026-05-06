/**
 * Formulário de abertura de chamado.
 *
 * Coleta os dados de um novo chamado (título, descrição, categoria
 * e tipo) e devolve esse pacote para quem usa o componente. O
 * formulário não sabe o que fazer com os dados depois: ele só
 * dispara aoEnviar e deixa que a página, ou o controlador no
 * futuro, decida.
 *
 * A triagem automática por inteligência artificial, que aparece
 * na versão final do produto, não fica neste componente. Ela vai
 * fazer parte da camada de regras e será adicionada em uma etapa
 * posterior, sem precisar alterar o que este formulário mostra.
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

/**
 * Formato dos dados que o formulário entrega quando é enviado.
 * Quem recebe esse pacote tem todos os campos validados pelo
 * componente.
 */
export interface DadosNovoChamado {
  titulo: string;
  descricao: string;
  categoria: CategoriaChamado;
  tipo: TipoChamado;
}

interface PropsFormularioAberturaChamado {
  /** Função chamada quando o usuário aperta Enviar com dados válidos. */
  aoEnviar?: (dados: DadosNovoChamado) => void;
}

export function FormularioAberturaChamado({
  aoEnviar,
}: PropsFormularioAberturaChamado) {
  // Estado interno do formulário. Cada campo guarda o que o
  // usuário está digitando.
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  // Categoria começa vazia para o select mostrar a opção
  // Selecione, e o usuário ser obrigado a fazer uma escolha
  // consciente.
  const [categoria, setCategoria] = useState<string>("");
  // Tipo começa em incidente porque é a situação mais comum.
  const [tipo, setTipo] = useState<TipoChamado>("incidente");

  /*
    Regra simples de validação local. O botão Enviar só fica
    disponível quando título e descrição têm algum texto, e a
    categoria escolhida está entre as categorias suportadas.
  */
  const podeEnviar =
    titulo.trim().length > 0 &&
    descricao.trim().length > 0 &&
    CATEGORIAS_DISPONIVEIS.includes(categoria as CategoriaChamado);

  /**
   * Submete o formulário. Confere a validação local mais uma vez,
   * dispara aoEnviar com os campos limpos e zera o formulário
   * depois do envio.
   */
  const submeter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!podeEnviar) return;
    aoEnviar?.({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      categoria: categoria as CategoriaChamado,
      tipo,
    });
    // Reseta os campos depois do envio para o usuário poder abrir
    // outro chamado em sequência.
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

      {/*
        Categoria e tipo ficam lado a lado em telas largas e
        empilhados em telas estreitas. A categoria usa a lista
        oficial vinda dos tipos da view.
      */}
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
