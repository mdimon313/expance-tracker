import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";
import { useCurrency } from "../context/CurrencyContext";
import { useLanguage } from "../context/LanguageContext";

export default function BalanceCard({ balance, income, expense }) {
  const { format } = useCurrency();
  const { t } = useLanguage();

  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <LinearGradient
        colors={["#10B981", "#059669", "#047857"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 28, padding: 22, shadowColor: "#10B981", shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 6 }}
      >
        <Text className="text-white/80 text-sm font-medium">{t("home.currentBalance")}</Text>
        <Text className="text-white text-4xl font-bold mt-1 mb-5">{format(balance)}</Text>

        <View className="flex-row justify-between">
          <View>
            <Text className="text-white/70 text-xs">{t("home.thisMonthIncome")}</Text>
            <Text className="text-white text-lg font-semibold mt-0.5">+{format(income)}</Text>
          </View>
          <View>
            <Text className="text-white/70 text-xs">{t("home.thisMonthExpense")}</Text>
            <Text className="text-white text-lg font-semibold mt-0.5">-{format(expense)}</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}
