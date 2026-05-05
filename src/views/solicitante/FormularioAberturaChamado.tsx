/**
 * Formulário para abrir um novo chamado.
 *
 * Coleta os dados de um chamado novo (título, descrição, categoria
 * e tipo) e devolve esse pacote para quem usa o componente.
 *
 * A parte de triagem automática por inteligência artificial, que
 * aparece na versão final do produto, não está aqui. Ela faz parte
 * da camada de regras e será adicionada em uma etapa posterior, sem
 * alterar o que este formulário mostra.
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

/** Pacote de dados que o formulário devolve quando é enviado. */
export interface DadosNovoChamado {
  titulo: string;
  descricao: string;
  categoria: CategoriaChamado;
  tipo: TipoChamado;
}

interface PropsFormularioAberturaChamado {
  /** Função chamada quando o usuário aperta Enviar. */
  aoEnviar?: (dados: DadosNovoChamado) => void;
}

export function FormularioAberturaChamado({
  aoEnviar,
}: PropsFormularioAberturaChamado) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState<string>("");
  const [tipo, setTipo] = useState<TipoChamado>("incidente");

  /** O botão só fica disponível com todos os campos preenchidos. */
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
    // Limpa os campos depois de enviar.
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
