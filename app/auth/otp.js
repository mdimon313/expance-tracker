import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Button from "../../src/components/Button";
import { useLanguage } from "../../src/context/LanguageContext";

// Polished OTP UI. Wired for Firebase Phone Authentication - swap
// `verifyCode` for a real confirmationResult.confirm(code) call once phone
// auth is enabled in the Firebase console.
export default function OtpScreen() {
  const { t } = useLanguage();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputs = useRef([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const handleChange = (text, index) => {
    const next = [...digits];
    next[index] = text.slice(-1);
    setDigits(next);
    if (text && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async () => {
    setError("");
    const code = digits.join("");
    if (code.length !== 6) { setError("Enter all 6 digits"); return; }
    setLoading(true);
    try {
      // await confirmationResult.confirm(code);
      router.replace("/(tabs)/home");
    } catch (e) {
      setError("Invalid code, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg px-6 justify-center">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify your number</Text>
      <Text className="text-gray-400 mb-8">Enter the 6-digit code we sent you</Text>

      <View className="flex-row justify-between mb-6">
        {digits.map((d, i) => (
          <TextInput
            key={i}
            ref={(r) => (inputs.current[i] = r)}
            value={d}
            onChangeText={(t) => handleChange(t, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            className="w-12 h-14 rounded-2xl text-center text-xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        ))}
      </View>

      {error ? <Text className="text-expense text-sm mb-4">{error}</Text> : null}

      <Button title="Verify" onPress={verifyCode} loading={loading} />

      <View className="flex-row justify-center mt-6">
        {seconds > 0 ? (
          <Text className="text-gray-400">Resend code in {seconds}s</Text>
        ) : (
          <Pressable onPress={() => setSeconds(30)}>
            <Text className="text-primary font-semibold">Resend OTP</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
