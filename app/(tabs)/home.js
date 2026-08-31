import React, { useRef } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import BalanceCard from "../../src/components/BalanceCard";
import TransactionList from "../../src/components/TransactionList";
import FAB from "../../src/components/FAB";
import QuickAddSheet from "../../src/components/QuickAddSheet";
import Skeleton from "../../src/components/Skeleton";
import { useTransactions } from "../../src/hooks/useTransactions";
import { useTheme } from "../../src/context/ThemeContext";
import { useLanguage } from "../../src/context/LanguageContext";
import { useAuthContext } from "../../src/context/AuthContext";

export default function Home() {
  const { transactions, loading, remove, monthly, totals } = useTransactions();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { profile } = useAuthContext();
  const sheetRef = useRef(null);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.bg }}
      edges={["top"]}
    >
      <View className="px-5 pt-2 pb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-400 text-sm">
            Hi{profile?.name ? "," : ""}
          </Text>
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            {profile?.name || "Welcome"}
          </Text>
        </View>
      </View>

      <View className="px-5">
        {loading ? (
          <Skeleton height={160} radius={28} />
        ) : (
          <BalanceCard
            balance={totals.balance}
            income={monthly.income}
            expense={monthly.expense}
          />
        )}
      </View>

      <View className="flex-row justify-between items-center px-5 mt-6 mb-2">
        <Text className="font-bold text-base" style={{ color: colors.text }}>
          {t("home.recentTransactions")}
        </Text>
        <Pressable onPress={() => router.push("/(tabs)/transactions")}>
          <Text className="text-primary text-sm font-medium">
            {t("home.seeAll")}
          </Text>
        </Pressable>
      </View>

      <View className="flex-1 px-5">
        <TransactionList
          transactions={transactions.slice(0, 15)}
          loading={loading}
          onDelete={remove}
        />
      </View>

      <FAB
        onPress={() => {
          sheetRef.current?.open();
        }}
      />
      <QuickAddSheet ref={sheetRef} />
    </SafeAreaView>
  );
}
