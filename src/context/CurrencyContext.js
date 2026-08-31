import React, { createContext, useContext, useMemo } from "react";
import { useAuthContext } from "./AuthContext";
import { updateUserCurrency } from "../services/userService";
import { formatCurrency } from "../i18n";
import { useLanguage } from "./LanguageContext";

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const { profile, refreshProfile } = useAuthContext();
  const { language } = useLanguage();
  const currency = profile?.currency || "BDT";

  const changeCurrency = async (newCurrency) => {
    await updateUserCurrency(newCurrency);
    await refreshProfile();
  };

  const format = useMemo(() => (amount) => formatCurrency(amount, currency, language), [currency, language]);

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
};
