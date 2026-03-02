import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Definição da estrutura de dados da Nexus Finanças
export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  paymentMethod: string;
  date: string;
}

const STORAGE_KEY = "nexus_financas_data"; // Atualizei a chave para combinar com sua nova marca

export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    queryFn: () => {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTx: Omit<Transaction, "id">) => {
      // Pequena pausa para simular processamento e evitar conflitos de escrita
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      const data = localStorage.getItem(STORAGE_KEY);
      const transactions = data ? JSON.parse(data) : [];
      
      const txWithId = { 
        ...newTx, 
        id: Date.now() 
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...transactions, txWithId]));
      return txWithId;
    },
    onSuccess: () => {
      // Atualiza o Dashboard e o Histórico instantaneamente
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
  });
}
