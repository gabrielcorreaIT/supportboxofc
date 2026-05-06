/**
 * Rota raiz do site.
 *
 * Quando alguém acessa o endereço base do projeto (a barra inicial),
 * o sistema redireciona direto para a tela de entrada. Não existe
 * página inicial pública porque o SupportBox é um sistema interno.
 *
 * No futuro, quando a parte de autenticação estiver pronta, este
 * desvio pode passar a olhar a sessão e levar o usuário direto para
 * o painel certo, caso ele já esteja entrado. Por enquanto, manda
 * todo mundo para /login.
 */
import { redirect } from "next/navigation";

export default function PaginaRaiz() {
  redirect("/login");
}
