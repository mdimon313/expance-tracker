import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function AccountSelector({ accounts, selected, onSelect }) {
  const { colors, isDark } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
      <View className="flex-row gap-2 px-0.5">
        {accounts.map((acc) => {
          const active = selected === acc.id;
          return (
            <Pressable
              key={acc.id}
              onPress={() => onSelect(acc)}
              className={`px-4 py-2.5 rounded-2xl mr-2 ${active ? "bg-primary" : ""}`}
              style={!active ? { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" } : null}
            >
              <Text style={{ color: active ? "#fff" : colors.text }} className="font-medium text-sm">{acc.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
