import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart, BarChart, LineChart } from "react-native-chart-kit";
import dayjs from "dayjs";
import Card from "../../src/components/Card";
import EmptyState from "../../src/components/EmptyState";
import { useTransactions } from "../../src/hooks/useTransactions";
import { useTheme } from "../../src/context/ThemeContext";
import { useCurrency } from "../../src/context/CurrencyContext";
import { CATEGORY_COLORS } from "../../src/constants/colors";

const screenWidth = Dimensions.get("window").width - 40;

export default function Analytics() {
  const { transactions, loading, refreshing, refresh } = useTransactions();
  const { colors, isDark } = useTheme();
  const { format } = useCurrency();

  const expenses = transactions.filter((t) => t.type === "expense");

  const pieData = useMemo(() => {
    const totals = {};
    expenses.forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + Number(t.amount);
    });
    return Object.entries(totals).map(([category, amount]) => ({
      name: category,
      amount,
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS.Other,
      legendFontColor: colors.text,
      legendFontSize: 12,
    }));
  }, [expenses, colors.text]);

  const weeklyTrend = useMemo(() => {
    const days = [...Array(7)].map((_, i) => dayjs().subtract(6 - i, "day"));
    const labels = days.map((d) => d.format("dd"));
    const data = days.map((d) =>
      expenses
        .filter((t) => dayjs(t.date).isSame(d, "day"))
        .reduce((s, t) => s + Number(t.amount), 0),
    );
    return { labels, datasets: [{ data: data.length ? data : [0] }] };
  }, [expenses]);

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: () => (isDark ? "#94A3B8" : "#64748B"),
    decimalPlaces: 0,
  };

  if (!loading && transactions.length === 0) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.bg }}
        edges={["top"]}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor="#10B981"
              colors={["#10B981"]}
            />
          }
        >
          <EmptyState
            icon="stats-chart-outline"
            title="No data yet"
            subtitle="Add a few transactions to see your analytics."
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.bg }}
      edges={["top"]}
    >
      <ScrollView
        className="px-5 pt-2"
        contentContainerStyle={{ paddingBottom: 140 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#10B981"
            colors={["#10B981"]}
          />
        }
      >
        <Text
          className="text-2xl font-bold mb-4"
          style={{ color: colors.text }}
        >
          Analytics
        </Text>

        {pieData.length > 0 && (
          <Card className="mb-4">
            <Text className="font-semibold mb-2" style={{ color: colors.text }}>
              Expense by Category
            </Text>
            <PieChart
              data={pieData}
              width={screenWidth}
              height={200}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="8"
            />
          </Card>
        )}

        <Card className="mb-4">
          <Text className="font-semibold mb-2" style={{ color: colors.text }}>
            Weekly Spending Trend
          </Text>
          <LineChart
            data={weeklyTrend}
            width={screenWidth - 16}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 16 }}
          />
        </Card>

        <Card className="mb-4">
          <Text className="font-semibold mb-3" style={{ color: colors.text }}>
            Top Spending Categories
          </Text>
          {pieData
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5)
            .map((c) => (
              <View
                key={c.name}
                className="flex-row justify-between items-center py-2"
              >
                <View className="flex-row items-center">
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: c.color,
                      marginRight: 8,
                    }}
                  />
                  <Text style={{ color: colors.text }}>{c.name}</Text>
                </View>
                <Text style={{ color: colors.text }} className="font-medium">
                  {format(c.amount)}
                </Text>
              </View>
            ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
