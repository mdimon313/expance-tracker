import { useEffect, useState } from "react";
import { subscribeToAccount as subscribeToAccounts } from "../services/accountService";
import { useAuthContext } from "../context/AuthContext";

export function useAccounts() {
  const { user } = useAuthContext();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setAccounts([]); setLoading(false); return; }
    setLoading(true);
    const unsubscribe = subscribeToAccounts((data) => { setAccounts(data); setLoading(false); });
    return () => unsubscribe && unsubscribe();
  }, [user?.uid]);

  return { accounts, loading };
}
