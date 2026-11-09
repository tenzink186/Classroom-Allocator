import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function PrimaryButton({ title, onPress, loading = false, secondary = false }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <Pressable onPress={onPress} disabled={loading} style={[styles.button, secondary && styles.secondary]}>
      {loading ? <ActivityIndicator color={secondary ? colors.text : "#fff"} /> :
        <Text style={[styles.text, secondary && styles.secondaryText]}>{title}</Text>}
    </Pressable>
  );
}
const createStyles = (colors) => StyleSheet.create({
  button: { backgroundColor: colors.primaryDark, padding: 14, borderRadius: 10, alignItems: "center", marginVertical: 6 },
  secondary: { backgroundColor: colors.secondarySurface },
  text: { color: "#fff", fontWeight: "700" },
  secondaryText: { color: colors.text },
});
