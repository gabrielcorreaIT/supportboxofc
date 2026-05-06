/**
 * Rota inicial. O sistema é interno, então não há página pública: o
 * acesso à raiz manda direto para a tela de entrada.
 */
import { redirect } from "next/navigation";

export default function PaginaRaiz() {
  redirect("/login");
}
