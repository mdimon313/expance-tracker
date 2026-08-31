import React from "react";
import { View, Text } from "react-native";
import Card from "./Card";
import ProgressBar from "./ProgressBar";
import { useCurrency } from "../context/CurrencyContext";
import { useTheme } from "../context/ThemeContext";

export default function SavingsGoalCard({ goal }) {
  const { format } = useCurrency();
  const { colors } = useTheme();
  const percent = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;

  return (
    <Card className="mb-3">
      <Text className="font-semibold text-base mb-2" style={{ color: colors.text }}>{goal.name}</Text>
      <ProgressBar percent={percent} />
      <View className="flex-row justify-between mt-2">
        <Text className="text-xs text-gray-400">{format(goal.currentAmount)} / {format(goal.targetAmount)}</Text>
        <Text className="text-xs font-medium text-primary">{Math.round(percent)}%</Text>
      </View>
    </Card>
  );
}
