import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { registerUser } from "../services/authService";

export default function RegisterScreen() {
  const [form, setForm] = useState({ name: "", studentId: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const set = (key, value) => setForm((old) => ({ ...old, [key]: value }));

  async function submit() {
    if (Object.values(form).some((v) => !v.trim())) return Alert.alert("Missing information", "Complete all fields.");
    if (form.password.length < 6) return Alert.alert("Password too short", "Use at least 6 characters.");
    try { setBusy(true); await registerUser(form); }
    catch (e) { Alert.alert("Registration failed", e.message); }
    finally { setBusy(false); }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create your account</Text>
      {[
        ["name", "Full name"], ["studentId", "Student ID"], ["email", "Email address"], ["password", "Password"]
      ].map(([key, label]) => (
        <TextInput key={key} style={styles.input} placeholder={label}
          autoCapitalize={key === "email" ? "none" : "words"} keyboardType={key === "email" ? "email-address" : "default"}
          secureTextEntry={key === "password"} value={form[key]} onChangeText={(v) => set(key, v)} />
      ))}
      <PrimaryButton title="Create account" onPress={submit} loading={busy} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 24, backgroundColor: "#F6F8FA" },
  heading: { fontSize: 25, fontWeight: "800", color: "#17324D", marginBottom: 20 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#D0D5DD", borderRadius: 10, padding: 14, marginVertical: 7 },
});
