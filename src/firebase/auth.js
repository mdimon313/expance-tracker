import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

import { auth } from "./config";

export const registerWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => fbSignOut(auth);

export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

export const updateAuthProfile = (profile) =>
  updateProfile(auth.currentUser, profile);

export const subscribeToAuthChanges = (callback) =>
  onAuthStateChanged(auth, callback);

export const getCurrentUser = () => auth.currentUser;

export const requireCurrentUser = () => {
  const user = auth.currentUser;
  if (!user) {
    const err = new Error("You must be signed in to do that.");
    err.code = "auth/not-authenticated";
    throw err;
  }
  return user;
};
