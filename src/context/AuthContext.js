import React, { createContext, useContext, useEffect, useState } from "react";
import { subscribeToAuthChanges } from "../firebase/auth";
import { getUserProfile } from "../services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const p = await getUserProfile(firebaseUser.uid);
          setProfile(p);
        } catch (e) {
          setProfile(null);
        }
      } else {
        // Clear all user-specific state on logout
        setProfile(null);
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const refreshProfile = async () => {
    if (!user) return;
    const p = await getUserProfile(user.uid);
    setProfile(p);
  };

  return (
    <AuthContext.Provider value={{ user, profile, initializing, refreshProfile, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
};
