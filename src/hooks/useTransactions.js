import { useEffect, useState, useCallback } from "react";
import { subscribeToTransactions, deleteTransaction, calculateBalances, calculateMonthlyTotals } from "../services/transactionService";
import { useAuthContext } from "../context/AuthContext";

export function useTransactions() {
  const { user } = useAuthContext();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = subscribeToTransactions((data) => {
      setTransactions(data);
      setLoading(false);
    });
    return () => unsubscribe && unsubscribe();
  }, [user?.uid]);

  const remove = useCallback(async (transaction) => {
    await deleteTransaction(transaction.id);
  }, []);

  const now = new Date();
  const monthly = calculateMonthlyTotals(transactions, now.getFullYear(), now.getMonth());
  const totals = calculateBalances(transactions);

  return { transactions, loading, remove, monthly, totals };
}
