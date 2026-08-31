import "../src/assets/global.css";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../src/context/AuthContext";
import { ThemeProvider } from "../src/context/ThemeContext";
import { LanguageProvider } from "../src/context/LanguageContext";
import { CurrencyProvider } from "../src/context/CurrencyContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <CurrencyProvider>
                <BottomSheetModalProvider>
                  <Stack screenOptions={{ headerShown: false }} />
                </BottomSheetModalProvider>
              </CurrencyProvider>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
