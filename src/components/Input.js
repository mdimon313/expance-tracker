import React from "react";
import { View, TextInput, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function Input({ label, error, style, ...props }) {
  const { colors, isDark } = useTheme();
  return (
    <View className="mb-4">
      {label ? <Text className="mb-1.5 text-sm font-medium" style={{ color: colors.text }}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
        className="rounded-2xl px-4 py-3.5 text-base"
        style={[
          { backgroundColor: isDark ? "#1E293B" : "#F1F5F9", color: colors.text, borderWidth: error ? 1 : 0, borderColor: "#EF4444" },
          style,
        ]}
        {...props}
      />
      {error ? <Text className="text-expense text-xs mt-1">{error}</Text> : null}
    </View>
  );
}
