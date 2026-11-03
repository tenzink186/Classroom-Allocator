import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

export default function ClassroomCard({ item, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.name}>{item.classroomNumber}</Text>
      <Text>{item.building} · {item.floor}</Text>
      {!!item.description && <Text style={styles.description}>{item.description}</Text>}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", padding: 16, marginVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: "#E1E7ED" },
  name: { fontSize: 18, fontWeight: "700", color: "#17324D" },
  description: { color: "#667085", marginTop: 4 },
});
