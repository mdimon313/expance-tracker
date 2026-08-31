import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import TransactionList from "../../src/components/TransactionList";
import { useTransactions } from "../../src/hooks/useTransactions";
import { useTheme } from "../../src/context/ThemeContext";
import { useLanguage } from "../../src/context/LanguageContext";

const SORTS = ["newest", "oldest", "highest", "lowest"];

export default function TransactionsScreen() {
  const { transactions, loading, remove } = useTransactions();
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((tx) => tx.category?.toLowerCase().includes(q) || tx.note?.toLowerCase().includes(q));
    }
    if (typeFilter !== "all") list = list.filter((tx) => tx.type === typeFilter);
    switch (sort) {
      case "oldest": list.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
      case "highest": list.sort((a, b) => b.amount - a.amount); break;
      case "lowest": list.sort((a, b) => a.amount - b.amount); break;
      default: list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return list;
  }, [transactions, search, typeFilter, sort]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.bg }} edges={["top"]}>
      <View className="px-5 pt-2 pb-3">
        <Text className="text-2xl font-bold mb-4" style={{ color: colors.text }}>{t("tabs.transactions")}</Text>

        <View className="flex-row items-center rounded-2xl px-3 mb-3" style={{ backgroundColor: isDark ? "#1E293B" : "#F1F5F9" }}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t("common.search")}
            placeholderTextColor="#94A3B8"
            className="flex-1 py-3 px-2"
            style={{ color: colors.text }}
          />
        </View>

        <View className="flex-row gap-2 mb-2">
          {["all", "income", "expense"].map((f) => (
            <Pressable key={f} onPress={() => setTypeFilter(f)} className={`px-3.5 py-2 rounded-xl ${typeFilter === f ? "bg-primary" : ""}`} style={typeFilter !== f ? { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" } : null}>
              <Text style={{ color: typeFilter === f ? "#fff" : colors.text }} className="text-sm font-medium capitalize">
                {f === "all" ? t("common.all") : t(`transaction.${f}`)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="flex-1 px-5">
        <TransactionList transactions={filtered} loading={loading} onDelete={remove} />
      </View>
    </SafeAreaView>
  );
}
