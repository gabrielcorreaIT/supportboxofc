/**
 * CAMADA: View (rota Next.js — Página Raiz)
 * ARQUIVO: src/app/page.tsx
 *
 * RESPONSABILIDADE
 *   Quando o usuário acessa "/", redireciona para "/login". Não há
 *   "landing page" — o SupportBox é um sistema interno.
 *
 * ENCAIXE NO MVC FUTURO
 *   Este redirecionamento permanece. O destino pode mudar quando
 *   a sessão real for implementada (ex.: ir para /agente se já
 *   logado), mas isso será uma decisão do AuthController.
 */
import { redirect } from "next/navigation";

export default function PaginaRaiz() {
  redirect("/login");
}
