/**
 * Página raiz do site.
 *
 * Quando o usuário acessa a barra inicial do endereço, mandamos
 * direto para a tela de entrada. Não existe página inicial pública,
 * o sistema é interno.
 *
 * No futuro, com a parte de autenticação ligada, esse desvio pode
 * passar a olhar a sessão e levar o usuário direto para o painel
 * dele caso já esteja entrado.
 */
import { redirect } from "next/navigation";

export default function PaginaRaiz() {
  redirect("/login");
}
