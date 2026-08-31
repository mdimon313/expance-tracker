import React from "react";
import { View, Text } from "react-native";
import Card from "./Card";
import { useCurrency } from "../context/CurrencyContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { formatDate } from "../i18n";

const STATUS_COLOR = { paid: "#10B981", pending: "#F59E0B", overdue: "#EF4444" };

export default function DebtCard({ debt }) {
  const { format } = useCurrency();
  const { colors } = useTheme();
  const { language } = useLanguage();

  return (
    <Card className="mb-3">
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="font-semibold text-base" style={{ color: colors.text }}>{debt.person}</Text>
          <Text className="text-xs text-gray-400 mt-0.5">
            {debt.direction === "lend" ? "You lent" : "You borrowed"} · Due {formatDate(debt.dueDate, language)}
          </Text>
        </View>
        <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: `${STATUS_COLOR[debt.status]}22` }}>
          <Text className="text-xs font-semibold" style={{ color: STATUS_COLOR[debt.status] }}>{debt.status}</Text>
        </View>
      </View>
      <Text className="text-xl font-bold mt-3" style={{ color: colors.text }}>{format(debt.remainingAmount)}</Text>
    </Card>
  );
}
