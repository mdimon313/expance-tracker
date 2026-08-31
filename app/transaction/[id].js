import React, { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import Button from "../../src/components/Button";
import AmountInput from "../../src/components/AmountInput";
import { useTheme } from "../../src/context/ThemeContext";
import { useLanguage } from "../../src/context/LanguageContext";
import { getTransaction, updateTransaction, deleteTransaction } from "../../src/services/transactionService";

// Edit screen for a single transaction, reached from a swipe-to-edit action.
export default function EditTransaction() {
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getTransaction(id).then((tx) => {
      if (tx) { setAmount(String(tx.amount)); setNote(tx.note || ""); }
      setLoading(false);
    });
  }, [id]);

  const save = async () => {
    setSaving(true);
    try {
      await updateTransaction(id, { amount: Number(amount), note });
      router.back();
    } finally { setSaving(false); }
  };

  const remove = async () => { await deleteTransaction(id); router.back(); };

  if (loading) return null;

  return (
    <SafeAreaView className="flex-1 px-5" style={{ backgroundColor: colors.bg }}>
      <Text className="text-xl font-bold mt-4 mb-2" style={{ color: colors.text }}>{t("common.edit")}</Text>
      <AmountInput value={amount} onChangeText={setAmount} />
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder={t("transaction.notes")}
        placeholderTextColor="#94A3B8"
        className="rounded-2xl px-4 py-3 mb-4"
        style={{ backgroundColor: isDark ? "#1E293B" : "#F1F5F9", color: colors.text }}
      />
      <Button title={t("common.save")} onPress={save} loading={saving} />
      <Button title={t("common.delete")} onPress={remove} variant="danger" className="mt-3" />
    </SafeAreaView>
  );
}
