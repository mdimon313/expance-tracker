import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import dayjs from "dayjs";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import AmountInput from "./AmountInput";
import Button from "./Button";
import { EXPENSE_CATEGORIES } from "../constants/categories";
import { createBudget, updateBudget } from "../services/budgetService";

// Opened from the Budget tab's FAB. Lets the user pick an expense
// category and a monthly limit. If a budget already exists for that
// category + month it updates it instead of creating a duplicate.
const AddBudgetSheet = forwardRef(({ existingBudgets = [] }, ref) => {
  const sheetRef = useRef(null);
  const { t } = useLanguage();
  const { colors, isDark } = useTheme();

  const [category, setCategory] = useState(null);
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [customCategory, setCustomCategory] = useState("");

  const snapPoints = useMemo(() => ["75%"], []);

  useImperativeHandle(ref, () => ({
    // Call with no args to create a new budget, or with an existing
    // budget object to edit it (pre-fills category + amount).
    open: (budgetToEdit) => {
      if (budgetToEdit) {
        setEditingBudget(budgetToEdit);
        setAmount(String(budgetToEdit.amount));
        const matched =
          EXPENSE_CATEGORIES.find((c) => c.id === budgetToEdit.categoryId) ||
          EXPENSE_CATEGORIES.find((c) => t(c.key) === budgetToEdit.category);
        setCategory(matched || null);
        setCustomCategory(
          matched?.id === "other" &&
            budgetToEdit.category !== t("category.other")
            ? budgetToEdit.category
            : "",
        );
      } else {
        setEditingBudget(null);
        setAmount("");
        setCategory(null);
        setCustomCategory("");
      }
      sheetRef.current?.present();
    },
    close: () => sheetRef.current?.dismiss(),
  }));

  const reset = () => {
    setCategory(null);
    setAmount("");
    setEditingBudget(null);
    setCustomCategory("");
  };

  const isOther = category?.id === "other";

  const handleSave = async () => {
    if (!category || !amount || Number(amount) <= 0) return;
    if (isOther && !customCategory.trim()) return;
    setSaving(true);
    const month = dayjs().format("YYYY-MM");
    const categoryLabel = isOther ? customCategory.trim() : t(category.key);
    try {
      if (editingBudget) {
        await updateBudget(editingBudget.id, {
          amount: Number(amount),
          category: categoryLabel,
          categoryId: category.id,
        });
      } else {
        const existing = existingBudgets.find(
          (b) => b.category === categoryLabel && b.month === month,
        );
        if (existing) {
          await updateBudget(existing.id, {
            amount: Number(amount),
            category: categoryLabel,
            categoryId: category.id,
          });
        } else {
          await createBudget({
            category: categoryLabel,
            categoryId: category.id,
            amount: Number(amount),
            month,
          });
        }
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      reset();
      sheetRef.current?.dismiss();
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSaving(false);
    }
  };

  const renderBackdrop = useCallback(
    (p) => (
      <BottomSheetBackdrop
        {...p}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.card }}
      handleIndicatorStyle={{ backgroundColor: "#94A3B8" }}
    >
      <BottomSheetView
        style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 24 }}
      >
        <Text className="text-lg font-bold mb-1" style={{ color: colors.text }}>
          {editingBudget ? t("Edit Budget") : t("Add Budget")}
        </Text>
        <Text className="text-xs text-gray-400 mb-2">
          {dayjs().format("MMMM YYYY")}
        </Text>

        <AmountInput
          value={amount}
          onChangeText={setAmount}
          autoFocus
          color="#10B981"
        />

        <Text className="text-xs font-medium text-gray-400 mb-2 ml-0.5">
          {t("Select Category")}
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {EXPENSE_CATEGORIES.map((cat) => {
            const active = category?.id === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => {
                  setCategory(cat);
                  if (cat.id !== "other") setCustomCategory("");
                }}
                className={`px-4 py-2.5 rounded-2xl ${active ? "bg-primary" : ""}`}
                style={
                  !active
                    ? { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" }
                    : null
                }
              >
                <Text
                  style={{ color: active ? "#fff" : colors.text }}
                  className="font-medium text-sm"
                >
                  {t(cat.key)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {isOther && (
          <TextInput
            value={customCategory}
            onChangeText={setCustomCategory}
            placeholder={t("Custom Category")}
            placeholderTextColor="#94A3B8"
            autoFocus
            className="rounded-2xl px-4 py-3 mb-6"
            style={{
              backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
              color: colors.text,
            }}
          />
        )}

        <Button
          title={t("common.save")}
          onPress={handleSave}
          loading={saving}
          disabled={!amount || !category || (isOther && !customCategory.trim())}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default AddBudgetSheet;
