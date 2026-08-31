import React from "react";
import { View, TextInput, Text } from "react-native";
import { useCurrency } from "../context/CurrencyContext";

export default function AmountInput({ value, onChangeText, autoFocus, color = "#10B981" }) {
  const { currency } = useCurrency();
  return (
    <View className="items-center py-6">
      <Text className="text-sm text-gray-400 mb-1">{currency}</Text>
      <View className="flex-row items-center">
        <Text style={{ color, fontSize: 40, fontWeight: "700" }}>{value ? "" : ""}</Text>
        <TextInput
          autoFocus={autoFocus}
          value={value}
          onChangeText={(t) => onChangeText(t.replace(/[^0-9.]/g, ""))}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor="#94A3B8"
          style={{ color, fontSize: 44, fontWeight: "700", minWidth: 120, textAlign: "center" }}
        />
      </View>
    </View>
  );
}
