import React from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";
import * as Haptics from "expo-haptics";

const VARIANTS = {
  primary: "bg-primary",
  danger: "bg-expense",
  outline: "bg-transparent border border-gray-300 dark:border-gray-600",
};
const TEXT_VARIANTS = {
  primary: "text-white",
  danger: "text-white",
  outline: "text-gray-900 dark:text-white",
};

export default function Button({ title, onPress, variant = "primary", loading, disabled, className = "" }) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };
  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      className={`rounded-2xl py-4 items-center justify-center ${VARIANTS[variant]} ${disabled ? "opacity-50" : ""} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#10B981" : "#fff"} />
      ) : (
        <Text className={`font-semibold text-base ${TEXT_VARIANTS[variant]}`}>{title}</Text>
      )}
    </Pressable>
  );
}
