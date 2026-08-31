import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function EmptyState({ icon = "document-outline", title, subtitle }) {
  const { colors, isDark } = useTheme();
  return (
    <View className="flex-1 items-center justify-center px-10 py-16">
      <View className="w-20 h-20 rounded-full items-center justify-center mb-4" style={{ backgroundColor: isDark ? "#1E293B" : "#F1F5F9" }}>
        <Ionicons name={icon} size={36} color="#10B981" />
      </View>
      <Text className="text-lg font-semibold text-center" style={{ color: colors.text }}>{title}</Text>
      {subtitle ? <Text className="text-sm text-gray-400 text-center mt-1.5">{subtitle}</Text> : null}
    </View>
  );
}
