import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Função utilitária padrão do shadcn/ui.
 * Ela serve para mesclar classes do Tailwind CSS de forma inteligente,
 * resolvendo conflitos (ex: se você passar 'p-4' e depois 'p-8',
 * ela garante que apenas 'p-8' seja aplicado no HTML final).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
