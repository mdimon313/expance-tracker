import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FAB({ onPress }) {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  };

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          right: 20,
          bottom: insets.bottom - 20,
          shadowColor: "#10B981",
          shadowOpacity: 0.5,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 8,
        },
        style,
      ]}
    >
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.9))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={handlePress}
        className="w-16 h-16 rounded-full bg-primary items-center justify-center"
        accessibilityLabel="Add transaction"
      >
        <Ionicons name="add" size={30} color="#fff" />
      </Pressable>
    </Animated.View>
  );
}
