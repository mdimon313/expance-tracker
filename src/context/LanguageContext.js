import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translate } from "../i18n";
import { useAuthContext } from "./AuthContext";
import { updateUserLanguage } from "../services/userService";

const LanguageContext = createContext(null);
const STORAGE_KEY = "app_language"; // "en" | "bn"

export const LanguageProvider = ({ children }) => {
  const { user, profile, refreshProfile } = useAuthContext();
  const [language, setLanguage] = useState("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLanguage(stored);
      } else {
        const deviceLang = Localization.getLocales?.()[0]?.languageCode;
        setLanguage(deviceLang === "bn" ? "bn" : "en");
      }
      setReady(true);
    })();
  }, []);

  // Once the user's Firestore profile loads, prefer their saved preference.
  useEffect(() => {
    if (profile?.language && profile.language !== language) {
      setLanguage(profile.language);
      AsyncStorage.setItem(STORAGE_KEY, profile.language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.language]);

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem(STORAGE_KEY, lang);
    if (user) {
      await updateUserLanguage(lang);
      await refreshProfile();
    }
  };

  const t = useMemo(() => (key) => translate(key, language), [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, ready }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
