import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOutLeft } from "react-native-reanimated";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";
import { Swipeable } from "react-native-gesture-handler";
import { router } from "expo-router";
import { useCurrency } from "../context/CurrencyContext";
import { useLanguage } from "../context/LanguageContext";
import { formatDate } from "../i18n";
import { CATEGORY_COLORS } from "../constants/colors";
import { useTheme } from "../context/ThemeContext";

export default function TransactionItem({ transaction, onEdit, onDelete }) {
  const { format } = useCurrency();
  const { language } = useLanguage();
  const { colors } = useTheme();
  const isIncome = transaction.type === "income";
  const color = CATEGORY_COLORS[transaction.category] || CATEGORY_COLORS.Other;

  const renderRightActions = () => (
    <Pressable onPress={() => onDelete?.(transaction)} className="bg-expense justify-center items-center w-20 rounded-r-2xl">
      <Ionicons name="trash" size={22} color="#fff" />
    </Pressable>
  );
  const renderLeftActions = () => (
    <Pressable
      onPress={() => (onEdit ? onEdit(transaction) : router.push(`/transaction/${transaction.id}`))}
      className="bg-primary justify-center items-center w-20 rounded-l-2xl"
    >
      <Ionicons name="create" size={22} color="#fff" />
    </Pressable>
  );

  return (
    <Animated.View entering={FadeIn} exiting={FadeOutLeft} className="mb-2">
      <Swipeable renderRightActions={renderRightActions} renderLeftActions={renderLeftActions}>
        <View
          className="flex-row items-center rounded-2xl p-3.5"
          style={{ backgroundColor: colors.card }}
        >
          <View className="w-11 h-11 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${color}22` }}>
            <Ionicons name={isIncome ? "arrow-down" : "cart"} size={20} color={color} />
          </View>
          <View className="flex-1">
            <Text className="font-semibold" style={{ color: colors.text }}>{transaction.category}</Text>
            <Text className="text-xs text-gray-400 mt-0.5">
              {formatDate(transaction.date, language)} · {transaction.accountName || ""}
            </Text>
          </View>
          <Text className={`font-bold text-base ${isIncome ? "text-primary" : "text-expense"}`}>
            {isIncome ? "+" : "-"}{format(transaction.amount)}
          </Text>
        </View>
      </Swipeable>
    </Animated.View>
  );
}
