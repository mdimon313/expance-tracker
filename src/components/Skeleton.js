import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";

export default function Skeleton({ width = "100%", height = 60, radius = 16, style }) {
  const opacity = useSharedValue(0.4);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800, easing: Easing.ease }), -1, true);
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[{ width, height, borderRadius: radius, backgroundColor: "#E2E8F0" }, animatedStyle, style]}
    />
  );
}
