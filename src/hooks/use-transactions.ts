import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  paymentMethod: string;
  date: string;
}

const STORAGE_KEY = "ezwallet_data";

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
      const data = localStorage.getItem(STORAGE_KEY);
      const transactions = data ? JSON.parse(data) : [];
      const txWithId = { ...newTx, id: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...transactions, txWithId]));
      return txWithId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
  });
}
