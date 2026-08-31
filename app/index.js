import React, { useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { useAuthContext } from "../src/context/AuthContext";

// Splash -> Location permission -> Onboarding (first run only) -> Auth/Main

export default function Index() {
  const { user, initializing } = useAuthContext();
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);
  const [locationChecked, setLocationChecked] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      const [onboardVal] = await Promise.all([
        AsyncStorage.getItem("onboardingCompleted"),
        Location.requestForegroundPermissionsAsync().catch(() => null),
      ]);
      setOnboardingCompleted(onboardVal === "true");
      setLocationChecked(true);
    })();
  }, []);

  const ready =
    !initializing && onboardingCompleted !== null && locationChecked;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-darkbg">
        <Animated.View entering={ZoomIn.duration(500)}>
          <View className="w-24 h-24 rounded-3xl bg-primary items-center justify-center">
            <Text className="text-white text-4xl font-bold">৳</Text>
          </View>
        </Animated.View>
        <Animated.Text
          entering={FadeIn.delay(300)}
          className="text-white text-xl font-semibold mt-6"
        >
          Expense Tracker
        </Animated.Text>
      </View>
    );
  }

  if (!onboardingCompleted) return <Redirect href="/onboarding" />;
  if (!user) return <Redirect href="/auth/login" />;
  return <Redirect href="/(tabs)/home" />;
}
