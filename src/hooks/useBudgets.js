import { useEffect, useState } from "react";
import { subscribeToBudget } from "../services/budgetService";
import { useAuthContext } from "../context/AuthContext";

export function useBudgets() {
  const { user } = useAuthContext();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setBudgets([]); setLoading(false); return; }
    setLoading(true);
    const unsubscribe = subscribeToBudget((data) => { setBudgets(data); setLoading(false); });
    return () => unsubscribe && unsubscribe();
  }, [user?.uid]);

  return { budgets, loading };
}
