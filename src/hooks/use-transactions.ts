import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  paymentMethod: string; // Novo campo para Cartão, Pix, etc.
  date: string;
}

const STORAGE_KEY = "ezwallet_data";

export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    queryFn: () => {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        // Garante que o app não trave se o banco estiver vazio ou corrompido
        return data ? JSON.parse(data) : [];
      } catch (e) {
        return [];
      }
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTx: Omit<Transaction, "id">) => {
      const data = localStorage.getItem(STORAGE_KEY);
      const transactions = data ? JSON.parse(data) : [];
      const txWithId = { ...newTx, id: Date.now() };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...transactions, txWithId]));
      return txWithId;
    },
    onSuccess: () => {
      // Força a atualização imediata da Dashboard e do Histórico do mestre
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const transactions = JSON.parse(data).filter((t: Transaction) => t.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
  });
}
