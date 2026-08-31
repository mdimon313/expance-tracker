import React from "react";
import { View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function Card({ children, style, className = "" }) {
  const { colors } = useTheme();
  return (
    <View
      className={`rounded-3xl p-4 ${className}`}
      style={[{ backgroundColor: colors.card, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 }, style]}
    >
      {children}
    </View>
  );
}
