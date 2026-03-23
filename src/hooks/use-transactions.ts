import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

const STORAGE_KEY = "nexus_financas_data";

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
      await new Promise((resolve) => setTimeout(resolve, 300));
      const data = localStorage.getItem(STORAGE_KEY);
      const transactions: Transaction[] = data ? JSON.parse(data) : [];
      const txWithId: Transaction = { ...newTx, id: crypto.randomUUID() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...transactions, txWithId]));
      return txWithId;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/transactions"] }),
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const data = localStorage.getItem(STORAGE_KEY);
      const transactions: Transaction[] = data ? JSON.parse(data) : [];
      const filtered = transactions.filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/transactions"] }),
  });
}

// NOVO: Sensor de Reescrita para corrigir o erro de Build
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedTx: Transaction) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const data = localStorage.getItem(STORAGE_KEY);
      const transactions: Transaction[] = data ? JSON.parse(data) : [];
      const newTransactions = transactions.map((t) => 
        t.id === updatedTx.id ? { ...t, ...updatedTx } : t
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTransactions));
      return updatedTx;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/transactions"] }),
  });
}
