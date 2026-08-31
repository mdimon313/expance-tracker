import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, Text, Pressable, TextInput, Platform } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import AmountInput from "./AmountInput";
import CategorySelector from "./CategorySelector";
import AccountSelector from "./AccountSelector";
import Button from "./Button";
import { createTransaction } from "../services/transactionService";
import { useAccounts } from "../hooks/useAccounts";

// The core "3-second" flow: tap FAB -> pick income/expense -> type amount
// (already focused) -> tap save. Category/account default to sensible
// values so a save is possible the instant an amount is typed.
//
// Uses BottomSheetModal (not the plain BottomSheet) so it portals to the
// app root via BottomSheetModalProvider (set up in app/_layout.js). This
// is what lets it open reliably from a FAB nested inside a tab screen,
// on top of the tab bar, regardless of the parent layout.
const QuickAddSheet = forwardRef((props, ref) => {
  const sheetRef = useRef(null);
  const { t } = useLanguage();
  const { colors, isDark } = useTheme();
  const { accounts } = useAccounts();

  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(null);
  const [account, setAccount] = useState(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const snapPoints = useMemo(() => ["80%"], []);

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.present(),
    close: () => sheetRef.current?.dismiss(),
  }));

  const reset = () => {
    setAmount("");
    setNote("");
    setType("income");
    setCategory(null);
  };

  const handleSave = async () => {
    if (!amount || Number(amount) <= 0) return;
    setSaving(true);
    try {
      await createTransaction({
        type,
        amount: Number(amount),
        category: category?.id ? t(category.key) : t("category.other"),
        accountId: account?.id || accounts?.[0]?.id || null,
        accountName: account?.name || accounts?.[0]?.name || "",
        note,
        date: new Date().toISOString(),
      });
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
  const accentColor = type === "income" ? "#10B981" : "#EF4444";

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
        <View
          className="flex-row rounded-2xl p-1 mb-2"
          style={{ backgroundColor: isDark ? "#0F172A" : "#F1F5F9" }}
        >
          {["income", "expense"].map((k) => (
            <Pressable
              key={k}
              onPress={() => setType(k)}
              className={`flex-1 py-2.5 rounded-xl items-center ${type === k ? (k === "income" ? "bg-primary" : "bg-expense") : ""}`}
            >
              <Text
                className={
                  type === k
                    ? "text-white font-semibold"
                    : "text-gray-400 font-medium"
                }
              >
                {t(`transaction.${k}`)}
              </Text>
            </Pressable>
          ))}
        </View>

        <AmountInput
          value={amount}
          onChangeText={setAmount}
          autoFocus
          color={accentColor}
        />

        <Text className="text-xs font-medium text-gray-400 mb-2 ml-0.5">
          {t("transaction.category")}
        </Text>
        <CategorySelector
          type={type}
          selected={category?.id}
          onSelect={setCategory}
        />

        {accounts?.length > 0 && (
          <>
            <Text className="text-xs font-medium text-gray-400 mb-2 ml-0.5">
              {t("transaction.account")}
            </Text>
            <AccountSelector
              accounts={accounts}
              selected={account?.id}
              onSelect={setAccount}
            />
          </>
        )}

        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder={t("transaction.notes")}
          placeholderTextColor="#94A3B8"
          className="rounded-2xl px-4 py-3 mb-4"
          style={{
            backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
            color: colors.text,
          }}
        />

        <Button
          title={t("common.save")}
          onPress={handleSave}
          loading={saving}
          disabled={!amount}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default QuickAddSheet;
