import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Transaction {
  id: string; // Alterado para string para maior compatibilidade com IDs gerados
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  paymentMethod: string;
  date: string;
}

const STORAGE_KEY = "nexus_financas_data";

/**
 * Sensor de Leitura: Busca todas as transações no cofre
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
 * Sensor de Escrita: Adiciona uma nova operação
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTx: Omit<Transaction, "id">) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const data = localStorage.getItem(STORAGE_KEY);
      const transactions: Transaction[] = data ? JSON.parse(data) : [];
      
      const txWithId: Transaction = { 
        ...newTx, 
        id: crypto.randomUUID() // Gera um ID único e moderno
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...transactions, txWithId]));
      return txWithId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
  });
}

/**
 * Sensor de Purga: Remove uma operação permanentemente
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      
      const data = localStorage.getItem(STORAGE_KEY);
      const transactions: Transaction[] = data ? JSON.parse(data) : [];
      
      const filteredTransactions = transactions.filter(t => t.id !== id);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTransactions));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
  });
}
