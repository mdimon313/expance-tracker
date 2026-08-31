import en from "./en";
import bn from "./bn";

export const LOCALES = { en, bn };
export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা" },
];

// Simple dot-path translator: t("auth.login", currentLanguage)
export const translate = (key, lang = "en") => {
  const dict = LOCALES[lang] || LOCALES.en;
  const value = key.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), dict);
  if (value !== undefined) return value;
  // fall back to English, then to the raw key so nothing ever renders blank
  const fallback = key.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), LOCALES.en);
  return fallback !== undefined ? fallback : key;
};

// Firebase error code -> localized friendly message
export const translateFirebaseError = (code, lang = "en") => {
  const map = {
    "auth/invalid-email": "errors.invalidEmail",
    "auth/user-not-found": "errors.wrongPassword",
    "auth/wrong-password": "errors.wrongPassword",
    "auth/invalid-credential": "errors.wrongPassword",
    "auth/email-already-in-use": "errors.emailInUse",
    "auth/weak-password": "errors.weakPassword",
    "auth/network-request-failed": "errors.networkError",
  };
  return translate(map[code] || "errors.generic", lang);
};

export const formatCurrency = (amount, currency = "BDT", lang = "en") => {
  const locale = lang === "bn" ? "bn-BD" : "en-US";
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount || 0);
  } catch (e) {
    return `${amount} ${currency}`;
  }
};

export const formatDate = (date, lang = "en") => {
  const locale = lang === "bn" ? "bn-BD" : "en-US";
  const d = date?.toDate ? date.toDate() : new Date(date);
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(d);
};
