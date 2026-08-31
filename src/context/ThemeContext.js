import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../constants/colors";

const ThemeContext = createContext(null);
const STORAGE_KEY = "theme_preference"; // "light" | "dark" | "system"

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState("system");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) setPreference(val);
    });
  }, []);

  const resolvedTheme = preference === "system" ? systemScheme || "light" : preference;
  const isDark = resolvedTheme === "dark";

  const setThemePreference = async (value) => {
    setPreference(value);
    await AsyncStorage.setItem(STORAGE_KEY, value);
  };

  const colors = isDark
    ? { bg: COLORS.darkBg, card: COLORS.darkCard, text: COLORS.textLight, border: COLORS.borderDark }
    : { bg: COLORS.lightBg, card: COLORS.lightCard, text: COLORS.textDark, border: COLORS.border };

  return (
    <ThemeContext.Provider value={{ preference, setThemePreference, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
