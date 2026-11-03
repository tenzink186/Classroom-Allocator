import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { loginUser } from "../services/authService";

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin() {
    if (!identifier.trim() || !password) return Alert.alert("Missing information", "Enter your email/student ID and password.");
    try { setBusy(true); await loginUser(identifier, password); }
    catch (e) { Alert.alert("Login failed", e.message); }
    finally { setBusy(false); }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <Text style={styles.logo}>ClassFind</Text>
      <Text style={styles.subtitle}>Find your classroom at CST</Text>
      <TextInput style={styles.input} placeholder="Email or Student ID" autoCapitalize="none" value={identifier} onChangeText={setIdentifier} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <PrimaryButton title="Log in" onPress={handleLogin} loading={busy} />
      <PrimaryButton title="Create student account" secondary onPress={() => navigation.navigate("Register")} />
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#F6F8FA" },
  logo: { fontSize: 34, fontWeight: "800", color: "#17324D", textAlign: "center" },
  subtitle: { textAlign: "center", color: "#667085", marginBottom: 30, marginTop: 8 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#D0D5DD", borderRadius: 10, padding: 14, marginVertical: 7 },
});
