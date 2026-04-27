/**
 * CAMADA: Infraestrutura — Pagina Raiz (Redirecionamento)
 * ARQUIVO: src/app/page.tsx
 *
 * DESCRICAO:
 *   Quando o usuario acessa a raiz do site ("/"), redireciona
 *   automaticamente para a pagina de login.
 */
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}
