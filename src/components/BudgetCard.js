import React, { useRef } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable, RectButton } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOutLeft } from "react-native-reanimated";
import Card from "./Card";
import ProgressBar from "./ProgressBar";
import { useCurrency } from "../context/CurrencyContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { router } from "expo-router";

export default function BudgetCard({ budget, spent, onEdit, onDelete }) {
  const { format } = useCurrency();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const swipeableRef = useRef(null);
  const percent = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
  const remaining = Math.max(budget.amount - spent, 0);

  // RectButton (from react-native-gesture-handler) is used here instead of
  // RN's Pressable/TouchableOpacity: action buttons rendered inside a
  // Swipeable's renderLeftActions/renderRightActions sit on top of the
  // same pan-gesture surface that powers the swipe itself, and a plain
  // Pressable's tap can get swallowed by that gesture recognizer. RectButton
  // is Gesture-Handler-native and reliably receives the tap.
  const handleEdit = () => {
    swipeableRef.current?.close();
    // onEdit?.(budget);
    onEdit ? onEdit(budget) : router.push(`/budget/${budget.id}`);
  };
  const handleDelete = () => {
    swipeableRef.current?.close();
    onDelete?.(budget);
  };

  const renderRightActions = () => (
    <RectButton
      onPress={handleDelete}
      style={{
        backgroundColor: "#EF4444",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
      }}
    >
      <Ionicons name="trash" size={22} color="#fff" />
    </RectButton>
  );
  const renderLeftActions = () => (
    <RectButton
      onPress={handleEdit}
      style={{
        backgroundColor: "#10B981",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
      }}
    >
      <Ionicons name="create" size={22} color="#fff" />
    </RectButton>
  );

  return (
    <Animated.View entering={FadeIn} exiting={FadeOutLeft} className="mb-3">
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        // renderLeftActions={renderLeftActions}
      >
        <Card>
          <View className="flex-row justify-between items-center mb-2">
            <Text
              className="font-semibold text-base"
              style={{ color: colors.text }}
            >
              {budget.category}
            </Text>
            <Text className="text-xs text-gray-400">
              {Math.round(percent)}%
            </Text>
          </View>
          <ProgressBar percent={percent} />
          <View className="flex-row justify-between mt-2">
            <Text className="text-xs text-gray-400">
              {t("budget.spent")}: {format(spent)}
            </Text>
            <Text className="text-xs text-gray-400">
              {t("budget.remaining")}: {format(remaining)}
            </Text>
          </View>
        </Card>
      </Swipeable>
    </Animated.View>
  );
}
