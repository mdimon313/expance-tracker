import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Input from "../../src/components/Input";
import Button from "../../src/components/Button";
import { useLanguage } from "../../src/context/LanguageContext";
import { forgotPassword } from "../../src/services/authService";
import { translateFirebaseError } from "../../src/i18n";

export default function ForgotPassword() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error"
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setStatus("success");
      setMessage("Check your inbox for a reset link.");
    } catch (e) {
      setStatus("error");
      setMessage(translateFirebaseError(e.code, language));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
        <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{t("auth.resetPassword")}</Text>
        <Text className="text-gray-400 mb-8">We'll email you a reset link</Text>
        <Input label={t("auth.email")} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        {message ? (
          <Text className={`text-sm mb-3 ${status === "success" ? "text-primary" : "text-expense"}`}>{message}</Text>
        ) : null}
        <Button title={t("auth.sendResetLink")} onPress={handleSend} loading={loading} />
        <Button title={t("common.cancel")} onPress={() => router.back()} variant="outline" className="mt-3" />
      </ScrollView>
    </SafeAreaView>
  );
}
