import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../constants/categories";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

export default function CategorySelector({ type, selected, onSelect }) {
  const { t } = useLanguage();
  const { colors, isDark } = useTheme();
  const list = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
      <View className="flex-row gap-2 px-0.5">
        {list.map((cat) => {
          const active = selected === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => onSelect(cat)}
              className={`px-4 py-2.5 rounded-2xl flex-row items-center mr-2 ${active ? "bg-primary" : ""}`}
              style={!active ? { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" } : null}
            >
              <Ionicons name={cat.icon} size={16} color={active ? "#fff" : colors.text} style={{ marginRight: 6 }} />
              <Text style={{ color: active ? "#fff" : colors.text }} className="font-medium text-sm">
                {t(cat.key)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
