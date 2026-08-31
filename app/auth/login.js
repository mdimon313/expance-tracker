import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Input from "../../src/components/Input";
import Button from "../../src/components/Button";
import { useLanguage } from "../../src/context/LanguageContext";
import {
  login,
  authenticateWithBiometrics,
  isBiometricLoginEnabled,
} from "../../src/services/authService";
import { translateFirebaseError } from "../../src/i18n";

export default function Login() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bioAvailable, setBioAvailable] = useState(false);

  useEffect(() => {
    isBiometricLoginEnabled().then(setBioAvailable);
  }, []);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/(tabs)/home");
    } catch (e) {
      setError(translateFirebaseError(e.code, language));
    } finally {
      setLoading(false);
    }
  };

  const handleBiometric = async () => {
    try {
      await authenticateWithBiometrics();
      // Firebase's own persisted session (restored automatically) takes it from here.
      router.replace("/(tabs)/home");
    } catch (e) {
      setError(t("errors.generic"));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-16 h-16 rounded-2xl bg-primary items-center justify-center mb-6">
            <Ionicons name="wallet" size={30} color="#fff" />
          </View>
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {t("auth.login")}
          </Text>
          <Text className="text-gray-400 mb-8">Welcome back</Text>

          <Input
            label={t("auth.emailOrPhone")}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            label={t("auth.password")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? (
            <Text className="text-expense text-sm mb-3">{error}</Text>
          ) : null}

          <Link href="/auth/forgot-password" asChild>
            <Pressable className="self-end mb-6">
              <Text className="text-primary font-medium text-sm">
                {t("auth.forgotPassword")}
              </Text>
            </Pressable>
          </Link>

          <Button
            title={t("auth.signIn")}
            onPress={handleLogin}
            loading={loading}
          />

          {bioAvailable && (
            <Pressable
              onPress={handleBiometric}
              className="flex-row items-center justify-center mt-4 py-3"
            >
              <Ionicons name="finger-print" size={20} color="#10B981" />
              <Text className="text-primary font-medium ml-2">
                {t("auth.biometricLogin")}
              </Text>
            </Pressable>
          )}

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-400">{t("auth.dontHaveAccount")} </Text>
            <Link href="/auth/register" asChild>
              <Pressable>
                <Text className="text-primary font-semibold">
                  {t("auth.signUp")}
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
