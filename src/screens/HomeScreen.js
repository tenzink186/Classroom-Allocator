import React from "react";
import { Alert, ScrollView, Text, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";

export default function HomeScreen({ navigation }) {
  const { profile } = useAuth();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>Hello, {profile?.name || "Student"} 👋</Text>
      <Text style={styles.info}>Where is your next classroom?</Text>
      <PrimaryButton title="Search classrooms" onPress={() => navigation.navigate("Search")} />
      <PrimaryButton title="Open campus map" secondary onPress={() => navigation.navigate("Map")} />
      {profile?.role === "admin" && <PrimaryButton title="Manage classrooms (Admin)" onPress={() => navigation.navigate("Admin")} />}
      <PrimaryButton title="Log out" secondary onPress={() => Alert.alert("Log out", "Are you sure?", [
        { text: "Cancel", style: "cancel" }, { text: "Log out", style: "destructive", onPress: logoutUser }
      ])} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 24, backgroundColor: "#F6F8FA" },
  greeting: { fontSize: 28, fontWeight: "800", color: "#17324D" },
  info: { color: "#667085", fontSize: 16, marginVertical: 12, marginBottom: 24 },
});
