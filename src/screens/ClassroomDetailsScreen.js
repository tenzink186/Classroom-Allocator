import React from "react";
import { Text, View, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { useTheme } from "../context/ThemeContext";

export default function ClassroomDetailsScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { classroom } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{classroom.classroomNumber}</Text>
      <Text style={styles.line}>Building: {classroom.building}</Text>
      <Text style={styles.line}>Floor: {classroom.floor}</Text>
      <Text style={styles.line}>Description: {classroom.description || "Not provided"}</Text>
      <Text style={styles.note}>The map destination uses the building/classroom GPS location entered by the administrator.</Text>
      <PrimaryButton title="Get directions" onPress={() => navigation.navigate("Map", { destination: classroom })} />
    </View>
  );
}
const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.background },
  title: { fontSize: 30, fontWeight: "800", color: colors.text, marginBottom: 20 },
  line: { fontSize: 16, marginVertical: 7, color: colors.mutedText },
  note: { marginVertical: 20, color: colors.secondaryText, lineHeight: 21 },
});
