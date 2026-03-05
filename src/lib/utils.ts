import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Função CN (Class Name Merger):
 * Combina classes do Tailwind e resolve conflitos de estilo automaticamente.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
