import React from "react";
import { View, ScrollView, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DebtCard from "../../src/components/DebtCard";
import EmptyState from "../../src/components/EmptyState";
import { useTheme } from "../../src/context/ThemeContext";
import { subscribeToDebt } from "../../src/services/debtService";
import { useAuthContext } from "../../src/context/AuthContext";

export default function DebtLend() {
  const { colors } = useTheme();
  const { user } = useAuthContext();
  const [debts, setDebts] = React.useState([]);

  React.useEffect(() => {
    if (!user) return;
    const unsub = subscribeToDebt(setDebts);
    return unsub;
  }, [user?.uid]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.bg }} edges={["top"]}>
      <View className="flex-row items-center px-5 pt-2 pb-3">
        <Pressable onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color={colors.text} /></Pressable>
        <Text className="text-xl font-bold ml-2" style={{ color: colors.text }}>Debt & Lend</Text>
      </View>
      {debts.length === 0 ? (
        <EmptyState icon="people-outline" title="No debts or loans yet" subtitle="Track money you borrow or lend to others." />
      ) : (
        <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 140 }}>
          {debts.map((d) => <DebtCard key={d.id} debt={d} />)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
