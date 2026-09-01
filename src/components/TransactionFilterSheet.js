import React, { forwardRef, useImperativeHandle, useMemo, useRef, useCallback } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { TRANSACTION_SORTS } from "../constants/categories";

// Opened from the Transactions screen's "Filter & Sort" button. Both the
// sort order and the month filter apply immediately as they're tapped -
// same immediate-apply behavior as the existing income/expense chips - so
// there's no separate "Apply" step to keep in sync with.
const TransactionFilterSheet = forwardRef(({ sort, onChangeSort, month, onChangeMonth }, ref) => {
  const sheetRef = useRef(null);
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  const snapPoints = useMemo(() => ["65%"], []);

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.present(),
    close: () => sheetRef.current?.dismiss(),
  }));

  const renderBackdrop = useCallback(
    (p) => <BottomSheetBackdrop {...p} disappearsOnIndex={-1} appearsOnIndex={0} pressBehavior="close" />,
    []
  );

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.card }}
      handleIndicatorStyle={{ backgroundColor: "#94A3B8" }}
    >
      <BottomSheetView style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 24 }}>
        <Text className="text-lg font-bold mb-4" style={{ color: colors.text }}>
          {t("transaction.filterSort")}
        </Text>

        <Text className="text-xs font-medium text-gray-400 mb-2 ml-0.5">{t("common.sort")}</Text>
        <View className="mb-6">
          {TRANSACTION_SORTS.map((key) => {
            const active = sort === key;
            return (
              <Pressable
                key={key}
                onPress={() => onChangeSort(key)}
                className={`flex-row items-center justify-between px-4 py-3 rounded-2xl mb-2 ${active ? "bg-primary" : ""}`}
                style={!active ? { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" } : null}
              >
                <Text style={{ color: active ? "#fff" : colors.text }} className="font-medium text-sm">
                  {t(`transaction.sort_${key}`)}
                </Text>
                {active ? <Ionicons name="checkmark" size={18} color="#fff" /> : null}
              </Pressable>
            );
          })}
        </View>

        <Text className="text-xs font-medium text-gray-400 mb-2 ml-0.5">{t("transaction.month")}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap gap-2 pb-2">
            <Pressable
              onPress={() => onChangeMonth(null)}
              className={`px-4 py-2.5 rounded-2xl ${month === null ? "bg-primary" : ""}`}
              style={month !== null ? { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" } : null}
            >
              <Text style={{ color: month === null ? "#fff" : colors.text }} className="font-medium text-sm">
                {t("transaction.allMonths")}
              </Text>
            </Pressable>
            {months.map((m) => {
              const active = month === m;
              return (
                <Pressable
                  key={m}
                  onPress={() => onChangeMonth(m)}
                  className={`px-4 py-2.5 rounded-2xl ${active ? "bg-primary" : ""}`}
                  style={!active ? { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" } : null}
                >
                  <Text style={{ color: active ? "#fff" : colors.text }} className="font-medium text-sm">
                    {t(`common.months.${m}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default TransactionFilterSheet;
