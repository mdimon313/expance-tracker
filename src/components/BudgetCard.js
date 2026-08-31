import React from "react";
import { View, Text } from "react-native";
import Card from "./Card";
import ProgressBar from "./ProgressBar";
import { useCurrency } from "../context/CurrencyContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

export default function BudgetCard({ budget, spent }) {
  const { format } = useCurrency();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const percent = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
  const remaining = Math.max(budget.amount - spent, 0);

  return (
    <Card className="mb-3">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-semibold text-base" style={{ color: colors.text }}>{budget.category}</Text>
        <Text className="text-xs text-gray-400">{Math.round(percent)}%</Text>
      </View>
      <ProgressBar percent={percent} />
      <View className="flex-row justify-between mt-2">
        <Text className="text-xs text-gray-400">{t("budget.spent")}: {format(spent)}</Text>
        <Text className="text-xs text-gray-400">{t("budget.remaining")}: {format(remaining)}</Text>
      </View>
    </Card>
  );
}
