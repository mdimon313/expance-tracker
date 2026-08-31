import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../src/context/ThemeContext";
import { useLanguage } from "../../src/context/LanguageContext";

const ICONS = {
  home: "home",
  analytics: "stats-chart",
  budget: "pie-chart",
  transactions: "swap-vertical",
  settings: "settings",
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#10B981",
        tabBarInactiveTintColor: isDark ? "#64748B" : "#94A3B8",
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 58 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={focused ? ICONS[route.name] : `${ICONS[route.name]}-outline`} size={22} color={color} />
        ),
      })}
    >
      <Tabs.Screen name="home" options={{ title: t("tabs.home") }} />
      <Tabs.Screen name="analytics" options={{ title: t("tabs.analytics") }} />
      <Tabs.Screen name="budget" options={{ title: t("tabs.budget") }} />
      <Tabs.Screen name="transactions" options={{ title: t("tabs.transactions") }} />
      <Tabs.Screen name="settings" options={{ title: t("tabs.settings") }} />
    </Tabs>
  );
}
