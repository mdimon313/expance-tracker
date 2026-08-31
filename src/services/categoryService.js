import {
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  userSubcollection,
  userSubDoc,
  withTimestamps,
} from "../firebase/firestore";
import { requireCurrentUser } from "../firebase/auth";

// All reads/writes scoped to users/{currentUser.uid}/categories
const COLLECTION = "categories";

export const createCategory = async (data) => {
  const user = requireCurrentUser();
  const payload = withTimestamps(
    { ...data, userId: user.uid, createdBy: user.uid },
    true
  );
  const ref = await addDoc(userSubcollection(user.uid, COLLECTION), payload);
  return { id: ref.id, ...payload };
};

export const updateCategory = async (id, updates) => {
  const user = requireCurrentUser();
  const { userId, createdBy, ...safe } = updates;
  await updateDoc(userSubDoc(user.uid, COLLECTION, id), withTimestamps(safe));
};

export const deleteCategory = async (id) => {
  const user = requireCurrentUser();
  await deleteDoc(userSubDoc(user.uid, COLLECTION, id));
};

export const getCategoryList = async () => {
  const user = requireCurrentUser();
  const q = query(userSubcollection(user.uid, COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const subscribeToCategory = (callback) => {
  const user = requireCurrentUser();
  const q = query(userSubcollection(user.uid, COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
};
