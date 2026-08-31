import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import BudgetCard from "../../src/components/BudgetCard";
import EmptyState from "../../src/components/EmptyState";
import { useBudgets } from "../../src/hooks/useBudgets";
import { useTransactions } from "../../src/hooks/useTransactions";
import { useTheme } from "../../src/context/ThemeContext";
import { useLanguage } from "../../src/context/LanguageContext";

export default function BudgetScreen() {
  const { budgets, loading } = useBudgets();
  const { transactions } = useTransactions();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const currentMonth = dayjs().format("YYYY-MM");

  const spentByCategory = useMemo(() => {
    const map = {};
    transactions
      .filter((tx) => tx.type === "expense" && dayjs(tx.date).format("YYYY-MM") === currentMonth)
      .forEach((tx) => { map[tx.category] = (map[tx.category] || 0) + Number(tx.amount); });
    return map;
  }, [transactions]);

  const monthBudgets = budgets.filter((b) => b.month === currentMonth);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.bg }} edges={["top"]}>
      <View className="px-5 pt-2 pb-3">
        <Text className="text-2xl font-bold" style={{ color: colors.text }}>{t("budget.title")}</Text>
      </View>

      {!loading && monthBudgets.length === 0 ? (
        <EmptyState icon="pie-chart-outline" title={t("budget.noBudgetsTitle")} subtitle={t("budget.noBudgetsSubtitle")} />
      ) : (
        <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 140 }}>
          {monthBudgets.map((b) => (
            <BudgetCard key={b.id} budget={b} spent={spentByCategory[b.category] || 0} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
