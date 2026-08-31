import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

// Thin, reusable Firestore helpers. Services build on top of these so
// screens/components never touch Firestore directly.

export const userDoc = (userId) => doc(db, "users", userId);

export const userSubcollection = (userId, name) => collection(db, "users", userId, name);

export const userSubDoc = (userId, name, id) => doc(db, "users", userId, name, id);

export const withTimestamps = (data, isNew = false) => ({
  ...data,
  ...(isNew ? { createdAt: serverTimestamp() } : {}),
  updatedAt: serverTimestamp(),
});

export {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
};
