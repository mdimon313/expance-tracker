import {
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit as fsLimit,
  onSnapshot,
  userSubcollection,
  userSubDoc,
  withTimestamps,
} from "../firebase/firestore";
import { requireCurrentUser } from "../firebase/auth";

// Every read/write here is scoped to users/{currentUser.uid}/transactions.
// The userId is ALWAYS derived from the active Firebase Auth session, never
// from a value passed in by the UI.

const COLLECTION = "transactions";

export const createTransaction = async (transactionData) => {
  const user = requireCurrentUser();

  const payload = withTimestamps(
    {
      ...transactionData,
      userId: user.uid,
      createdBy: user.uid,
      amount: Number(transactionData.amount),
    },
    true
  );

  const ref = await addDoc(userSubcollection(user.uid, COLLECTION), payload);
  return { id: ref.id, ...payload };
};

export const updateTransaction = async (transactionId, updates) => {
  const user = requireCurrentUser();
  // userId is intentionally never overwritten here - ownership can't change.
  const { userId, createdBy, ...safeUpdates } = updates;
  await updateDoc(
    userSubDoc(user.uid, COLLECTION, transactionId),
    withTimestamps(safeUpdates)
  );
};

export const deleteTransaction = async (transactionId) => {
  const user = requireCurrentUser();
  await deleteDoc(userSubDoc(user.uid, COLLECTION, transactionId));
};

export const getTransaction = async (transactionId) => {
  const user = requireCurrentUser();
  const snap = await getDoc(userSubDoc(user.uid, COLLECTION, transactionId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/**
 * One-time fetch of the current user's transactions, newest first.
 * filters: { type, category, accountId, startDate, endDate }
 */
export const getTransactions = async (filters = {}, max = 100) => {
  const user = requireCurrentUser();
  const clauses = [orderBy("date", "desc"), fsLimit(max)];
  if (filters.type) clauses.unshift(where("type", "==", filters.type));
  if (filters.category) clauses.unshift(where("category", "==", filters.category));
  if (filters.accountId) clauses.unshift(where("accountId", "==", filters.accountId));

  const q = query(userSubcollection(user.uid, COLLECTION), ...clauses);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Realtime subscription to the current user's transactions.
 * Returns an unsubscribe function - always call it on unmount / logout.
 */
export const subscribeToTransactions = (callback, max = 100) => {
  const user = requireCurrentUser();
  const q = query(
    userSubcollection(user.uid, COLLECTION),
    orderBy("date", "desc"),
    fsLimit(max)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

// Client-side aggregation helpers. These only ever operate on data already
// scoped to the current user (see functions above).
export const calculateBalances = (transactions) => {
  return transactions.reduce(
    (acc, t) => {
      const amt = Number(t.amount) || 0;
      if (t.type === "income") acc.income += amt;
      else acc.expense += amt;
      acc.balance = acc.income - acc.expense;
      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );
};

export const calculateMonthlyTotals = (transactions, year, month) => {
  const inMonth = transactions.filter((t) => {
    const d = t.date?.toDate ? t.date.toDate() : new Date(t.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
  return calculateBalances(inMonth);
};
