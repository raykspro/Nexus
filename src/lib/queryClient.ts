import { QueryClient } from "@tanstack/react-query";

// Este é o cérebro que coordena as informações da Nexus
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita recargas desnecessárias quando o Senhor volta para a aba
      retry: false, // Se houver erro de leitura, o sistema reporta ao Senhor imediatamente
    },
  },
});
