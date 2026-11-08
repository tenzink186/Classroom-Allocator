import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

import { useTheme } from "../context/ThemeContext";
export default function ClassroomCard({ item, onPress }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.name}>{item.classroomNumber}</Text>
      <Text style={styles.meta}>{item.building} · {item.floor}</Text>
      {!!item.description && <Text style={styles.description}>{item.description}</Text>}
    </Pressable>
  );
}
const createStyles = (colors) => StyleSheet.create({
  card: { backgroundColor: colors.card, padding: 16, marginVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  name: { fontSize: 18, fontWeight: "700", color: colors.text },
  meta: { color: colors.secondaryText, marginTop: 3 },
  description: { color: colors.secondaryText, marginTop: 4 },
});
