import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function PrimaryButton({ title, onPress, loading = false, secondary = false }) {
  return (
    <Pressable onPress={onPress} disabled={loading} style={[styles.button, secondary && styles.secondary]}>
      {loading ? <ActivityIndicator color={secondary ? "#17324D" : "#fff"} /> :
        <Text style={[styles.text, secondary && styles.secondaryText]}>{title}</Text>}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: { backgroundColor: "#17324D", padding: 14, borderRadius: 10, alignItems: "center", marginVertical: 6 },
  secondary: { backgroundColor: "#E8EEF4" },
  text: { color: "#fff", fontWeight: "700" },
  secondaryText: { color: "#17324D" },
});
