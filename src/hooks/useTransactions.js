import { useEffect, useState, useCallback } from "react";
import {
  subscribeToTransactions,
  getTransactions,
  deleteTransaction,
  calculateBalances,
  calculateMonthlyTotals,
} from "../services/transactionService";
import { useAuthContext } from "../context/AuthContext";

export function useTransactions() {
  const { user } = useAuthContext();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  // Pull-to-refresh: the list already stays live via subscribeToTransactions
  // above, but this gives the pull gesture a real round-trip (re-fetching
  // via the existing one-time getTransactions() service) rather than just
  // spinning for show, which also helps if the realtime listener is
  // reconnecting after being offline.
  const refresh = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (e) {
      // no-op - the live subscription above will keep things in sync regardless
    } finally {
      setRefreshing(false);
    }
  }, [user?.uid]);

  const now = new Date();
  const monthly = calculateMonthlyTotals(
    transactions,
    now.getFullYear(),
    now.getMonth(),
  );
  const totals = calculateBalances(transactions);

  return {
    transactions,
    loading,
    remove,
    monthly,
    totals,
    refreshing,
    refresh,
  };
}
