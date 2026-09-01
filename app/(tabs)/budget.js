import React, { useMemo, useRef } from "react";
import { View, Text, ScrollView, Alert, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import BudgetCard from "../../src/components/BudgetCard";
import EmptyState from "../../src/components/EmptyState";
import FAB from "../../src/components/FAB";
import AddBudgetSheet from "../../src/components/AddBudgetSheet";
import { useBudgets } from "../../src/hooks/useBudgets";
import { useTransactions } from "../../src/hooks/useTransactions";
import { useTheme } from "../../src/context/ThemeContext";
import { useLanguage } from "../../src/context/LanguageContext";
import { deleteBudget } from "../../src/services/budgetService";

export default function BudgetScreen() {
  const { budgets, loading, refreshing, refresh } = useBudgets();
  const {
    transactions,
    refreshing: txRefreshing,
    refresh: refreshTransactions,
  } = useTransactions();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const sheetRef = useRef(null);
  const currentMonth = dayjs().format("YYYY-MM");

  // Spend totals are derived from transactions too, so refreshing this
  // screen refreshes both sources that feed it.
  const handleRefresh = () => {
    refresh();
    refreshTransactions();
  };
  const isRefreshing = refreshing || txRefreshing;

  const spentByCategory = useMemo(() => {
    const map = {};
    transactions
      .filter(
        (tx) =>
          tx.type === "expense" &&
          dayjs(tx.date).format("YYYY-MM") === currentMonth,
      )
      .forEach((tx) => {
        map[tx.category] = (map[tx.category] || 0) + Number(tx.amount);
      });
    return map;
  }, [transactions]);

  const monthBudgets = budgets.filter((b) => b.month === currentMonth);
  const isEmpty = !loading && monthBudgets.length === 0;

  const handleEdit = (budget) => {
    sheetRef.current?.open(budget);
  };

  const handleDelete = (budget) => {
    Alert.alert(budget.category, "Delete this budget?", [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: () => deleteBudget(budget.id),
      },
    ]);
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.bg }}
      edges={["top"]}
    >
      <View className="px-5 pt-2 pb-3">
        <Text className="text-2xl font-bold" style={{ color: colors.text }}>
          {t("budget.title")}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={
          isEmpty ? { flexGrow: 1, paddingBottom: 140 } : { paddingBottom: 140 }
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#10B981"
            colors={["#10B981"]}
          />
        }
      >
        {isEmpty ? (
          <EmptyState
            icon="pie-chart-outline"
            title={t("budget.noBudgetsTitle")}
            subtitle={t("budget.noBudgetsSubtitle")}
          />
        ) : (
          monthBudgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              spent={spentByCategory[b.category] || 0}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </ScrollView>

      <FAB onPress={() => sheetRef.current?.open()} />
      <AddBudgetSheet ref={sheetRef} existingBudgets={monthBudgets} />
    </SafeAreaView>
  );
}
