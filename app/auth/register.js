import React, { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "../../src/components/Input";
import Button from "../../src/components/Button";
import { useLanguage } from "../../src/context/LanguageContext";
import { register as registerUser } from "../../src/services/authService";
import { translateFirebaseError } from "../../src/i18n";
import { CURRENCIES } from "../../src/constants/categories";

const schema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const passwordStrength = (pw = "") => {
  if (pw.length >= 10 && /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) return "strong";
  if (pw.length >= 6) return "medium";
  return "weak";
};

export default function Register() {
  const { t, language } = useLanguage();
  const [currency, setCurrency] = useState("BDT");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const { control, handleSubmit, watch, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const pw = watch("password");
  const strength = useMemo(() => passwordStrength(pw), [pw]);
  const strengthColor = { weak: "#EF4444", medium: "#F59E0B", strong: "#10B981" }[strength];

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      await registerUser({ fullName: data.fullName, email: data.email.trim(), password: data.password, currency });
      router.replace("/(tabs)/home");
    } catch (e) {
      setServerError(translateFirebaseError(e.code, language));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{t("auth.register")}</Text>
          <Text className="text-gray-400 mb-8">Start tracking your finances</Text>

          <Controller control={control} name="fullName" render={({ field }) => (
            <Input label={t("auth.fullName")} value={field.value} onChangeText={field.onChange} error={errors.fullName?.message} />
          )} />
          <Controller control={control} name="email" render={({ field }) => (
            <Input label={t("auth.email")} value={field.value} onChangeText={field.onChange} autoCapitalize="none" keyboardType="email-address" error={errors.email?.message} />
          )} />
          <Controller control={control} name="password" render={({ field }) => (
            <Input label={t("auth.password")} value={field.value} onChangeText={field.onChange} secureTextEntry error={errors.password?.message} />
          )} />
          {pw ? (
            <Text style={{ color: strengthColor }} className="text-xs -mt-3 mb-3 font-medium">{t(`auth.${strength}`)}</Text>
          ) : null}
          <Controller control={control} name="confirmPassword" render={({ field }) => (
            <Input label={t("auth.confirmPassword")} value={field.value} onChangeText={field.onChange} secureTextEntry error={errors.confirmPassword?.message} />
          )} />

          <Text className="mb-2 text-sm font-medium text-gray-900 dark:text-white">{t("auth.currency")}</Text>
          <View className="flex-row gap-2 mb-6">
            {CURRENCIES.map((c) => (
              <Pressable key={c} onPress={() => setCurrency(c)} className={`px-4 py-2 rounded-xl ${currency === c ? "bg-primary" : "bg-gray-100 dark:bg-gray-800"}`}>
                <Text className={currency === c ? "text-white font-semibold" : "text-gray-500"}>{c}</Text>
              </Pressable>
            ))}
          </View>

          {serverError ? <Text className="text-expense text-sm mb-3">{serverError}</Text> : null}

          <Button title={t("auth.signUp")} onPress={handleSubmit(onSubmit)} loading={loading} />

          <View className="flex-row justify-center mt-8 mb-4">
            <Text className="text-gray-400">{t("auth.alreadyHaveAccount")} </Text>
            <Link href="/auth/login" asChild>
              <Pressable><Text className="text-primary font-semibold">{t("auth.signIn")}</Text></Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
