import { useEffect, useState, useCallback } from "react";
import { subscribeToBudget, getBudgetList } from "../services/budgetService";
import { useAuthContext } from "../context/AuthContext";

export function useBudgets() {
  const { user } = useAuthContext();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user) {
      setBudgets([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = subscribeToBudget((data) => {
      setBudgets(data);
      setLoading(false);
    });
    return () => unsubscribe && unsubscribe();
  }, [user?.uid]);

  // Same pull-to-refresh pattern as useTransactions: the list already
  // stays live via subscribeToBudget, this just gives the pull gesture a
  // real round-trip via the existing one-time getBudgetList() service.
  const refresh = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      const data = await getBudgetList();
      setBudgets(data);
    } catch (e) {
      // no-op - the live subscription above will keep things in sync regardless
    } finally {
      setRefreshing(false);
    }
  }, [user?.uid]);

  return { budgets, loading, refreshing, refresh };
}
