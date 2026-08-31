import React from "react";
import { View, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import SavingsGoalCard from "../../src/components/SavingsGoalCard";
import EmptyState from "../../src/components/EmptyState";
import { useTheme } from "../../src/context/ThemeContext";
import { useLanguage } from "../../src/context/LanguageContext";
import { subscribeToSavings } from "../../src/services/savingsService";
import { useAuthContext } from "../../src/context/AuthContext";

export default function SavingsGoals() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuthContext();
  const [goals, setGoals] = React.useState([]);

  React.useEffect(() => {
    if (!user) return;
    const unsub = subscribeToSavings(setGoals);
    return unsub;
  }, [user?.uid]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.bg }} edges={["top"]}>
      <View className="flex-row items-center px-5 pt-2 pb-3">
        <Pressable onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color={colors.text} /></Pressable>
        <Text className="text-xl font-bold ml-2" style={{ color: colors.text }}>Savings Goals</Text>
      </View>
      {goals.length === 0 ? (
        <EmptyState icon="rocket-outline" title="No savings goals yet" subtitle={t("savings.noGoalsSubtitle")} />
      ) : (
        <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 140 }}>
          {goals.map((g) => <SavingsGoalCard key={g.id} goal={g} />)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
