import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { COLORS } from "../constants/colors";

export default function ProgressBar({ percent = 0, height = 10 }) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(clamped, { duration: 600 });
  }, [clamped]);

  const style = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  const color = clamped >= 100 ? COLORS.expense : clamped >= 80 ? COLORS.warning : COLORS.primary;

  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: "#E2E8F0", overflow: "hidden" }}>
      <Animated.View style={[{ height, borderRadius: height / 2, backgroundColor: color }, style]} />
    </View>
  );
}
