import React, { useRef, useState } from "react";
import { View, Text, Pressable, useWindowDimensions, FlatList } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "../../src/context/LanguageContext";

const PAGES = [
  { icon: "wallet-outline", titleKey: "onboarding.page1Title", subtitleKey: "onboarding.page1Subtitle" },
  { icon: "pie-chart-outline", titleKey: "onboarding.page2Title", subtitleKey: "onboarding.page2Subtitle" },
  { icon: "bar-chart-outline", titleKey: "onboarding.page3Title", subtitleKey: "onboarding.page3Subtitle" },
];

const finishOnboarding = async () => {
  await AsyncStorage.setItem("onboardingCompleted", "true");
  router.replace("/auth/login");
};

function Dot({ index, scrollX, width }) {
  const style = useAnimatedStyle(() => {
    const w = interpolate(scrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [8, 24, 8], "clamp");
    const opacity = interpolate(scrollX.value, [(index - 1) * width, index * width, (index + 1) * width], [0.3, 1, 0.3], "clamp");
    return { width: w, opacity };
  });
  return <Animated.View style={[{ height: 8, borderRadius: 4, backgroundColor: "#10B981", marginHorizontal: 4 }, style]} />;
}

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const listRef = useRef(null);

  const onScroll = useAnimatedScrollHandler((e) => { scrollX.value = e.contentOffset.x; });

  const goNext = () => {
    if (index < PAGES.length - 1) {
      listRef.current?.scrollToOffset({ offset: (index + 1) * width, animated: true });
      setIndex(index + 1);
    } else {
      finishOnboarding();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="flex-row justify-end px-5 pt-2">
        <Pressable onPress={finishOnboarding}>
          <Text className="text-gray-400 font-medium">{t("common.skip")}</Text>
        </Pressable>
      </View>

      <Animated.FlatList
        ref={listRef}
        data={PAGES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={{ width }} className="items-center justify-center px-10">
            <View className="w-40 h-40 rounded-full bg-primary/10 items-center justify-center mb-10">
              <Ionicons name={item.icon} size={72} color="#10B981" />
            </View>
            <Text className="text-2xl font-bold text-center text-gray-900 dark:text-white">{t(item.titleKey)}</Text>
            <Text className="text-base text-gray-400 text-center mt-3">{t(item.subtitleKey)}</Text>
          </View>
        )}
      />

      <View className="flex-row justify-center mb-6">
        {PAGES.map((_, i) => (
          <Dot key={i} index={i} scrollX={scrollX} width={width} />
        ))}
      </View>

      <View className="px-6 mb-6">
        <Pressable onPress={goNext} className="bg-primary rounded-2xl py-4 items-center">
          <Text className="text-white font-semibold text-base">
            {index === PAGES.length - 1 ? t("common.getStarted") : t("common.next")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
