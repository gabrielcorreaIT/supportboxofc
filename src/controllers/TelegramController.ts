/**
 * CAMADA: Controller
 * ARQUIVO: src/controllers/TelegramController.ts
 *
 * DESCRICAO:
 *   Orquestra o processamento de mensagens recebidas pelo bot do Telegram.
 *   Um tecnico de TI em campo pode enviar texto ou audio pelo Telegram para
 *   atualizar chamados, adicionar comentarios ou tirar duvidas — tudo sem
 *   precisar abrir o sistema web.
 *
 *   Este Controller interpreta a intencao do tecnico usando IA (IAModel)
 *   e executa a acao correspondente via TicketController.
 *
 * CONEXOES:
 *   - Depende de: IAModel (interpreta texto/audio), TicketController (executa acoes)
 *   - Usado por:  src/app/api/telegram/route.ts (webhook HTTP do Telegram)
 *
 * FLUXO:
 *   Telegram -> API Route (HTTP) -> TelegramController (logica) -> IAModel + TicketController
 */
"use server";

import type { Part } from "@google/generative-ai";
import { IAModel } from "@/models/IAModel";
import {
  acaoObterDetalhesChamado,
  acaoAdicionarComentario,
  acaoAtualizarStatus,
} from "@/controllers/TicketController";

/**
 * Resultado padronizado devolvido ao API Route para que ele envie
 * a resposta de volta ao Telegram.
 */
export interface ResultadoComandoTelegram {
  textoResposta: string;
}

/**
 * Recebe as partes da mensagem (texto e/ou audio) do tecnico,
 * interpreta a intencao via IA e executa a acao no sistema.
 *
 * Acoes possiveis:
 *   - ATUALIZAR_STATUS: muda o status de um chamado (ex: "Concluido")
 *   - COMENTAR: adiciona um comentario ao historico do chamado
 *   - DUVIDA: responde uma pergunta sem alterar nenhum chamado
 *
 * @param partesEntrada - Conteudo da mensagem (texto e/ou audio em base64)
 * @param nomeTecnico   - Nome do tecnico que enviou a mensagem
 * @returns Texto de resposta para enviar de volta ao Telegram
 */
export async function acaoProcessarMensagemTelegram(
  partesEntrada: Part[],
  nomeTecnico: string,
): Promise<ResultadoComandoTelegram> {
  // 1. A IA interpreta a mensagem e extrai a intencao estruturada
  const comando = await IAModel.processarComandoTelegram(partesEntrada);

  // 2. Executa a acao identificada pela IA
  if (comando.acao === "ATUALIZAR_STATUS" && comando.id_chamado && comando.status_alvo) {
    const resultado = await acaoObterDetalhesChamado(comando.id_chamado);
    if (!resultado.sucesso || !resultado.dados) {
      return { textoResposta: `Chamado *${comando.id_chamado}* nao encontrado.` };
    }

    await acaoAtualizarStatus(resultado.dados.id, comando.status_alvo);

    if (comando.comentario) {
      await acaoAdicionarComentario(resultado.dados.id, nomeTecnico, comando.comentario);
    }

    return { textoResposta: comando.resposta_assistente };
  }

  if (comando.acao === "COMENTAR" && comando.id_chamado && comando.comentario) {
    const resultado = await acaoObterDetalhesChamado(comando.id_chamado);
    if (!resultado.sucesso || !resultado.dados) {
      return { textoResposta: `Chamado *${comando.id_chamado}* nao encontrado.` };
    }

    await acaoAdicionarComentario(resultado.dados.id, nomeTecnico, comando.comentario);
    return { textoResposta: comando.resposta_assistente };
  }

  // Acao "DUVIDA" ou qualquer outro caso: apenas devolve a resposta da IA
  return { textoResposta: comando.resposta_assistente };
}
