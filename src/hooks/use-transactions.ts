import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Exportamos a interface para que outros componentes possam usá-la como guia
export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  paymentMethod: string;
  date: string;
}

const STORAGE_KEY = "nexus_financas_data";

/**
 * Sensor de Leitura: Busca todas as transações guardadas no cofre (localStorage)
 */
export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    queryFn: () => {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    },
  });
}

/**
 * Sensor de Escrita: Adiciona uma nova operação ao cofre
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTx: Omit<Transaction, "id">) => {
      // Pequeno atraso para simular o processamento e garantir a fluidez da animação
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      const data = localStorage.getItem(STORAGE_KEY);
      const transactions: Transaction[] = data ? JSON.parse(data) : [];
      
      const txWithId: Transaction = { 
        ...newTx, 
        id: Date.now() 
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...transactions, txWithId]));
      return txWithId;
    },
    onSuccess: () => {
      // Notifica o cérebro (QueryClient) para atualizar todas as telas automaticamente
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
  });
}
