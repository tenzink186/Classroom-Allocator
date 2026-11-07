
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { registerUser } from "../services/authService";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    course: "",
    email: "",
    password: "",
  });

  const [busy, setBusy] = useState(false);

  const set = (key, value) => {
    setForm((old) => ({ ...old, [key]: value }));
  };

  async function submit() {
    if (Object.values(form).some((v) => !v.trim())) {
      return Alert.alert(
        "Missing information",
        "Please complete all fields."
      );
    }

    if (form.password.length < 6) {
      return Alert.alert(
        "Password too short",
        "Use at least 6 characters."
      );
    }

    try {
      setBusy(true);
      await registerUser(form);
    } catch (e) {
      Alert.alert("Registration failed", e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Create your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full name"
        autoCapitalize="words"
        value={form.name}
        onChangeText={(v) => set("name", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Student ID"
        autoCapitalize="characters"
        value={form.studentId}
        onChangeText={(v) => set("studentId", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Programme"
        autoCapitalize="words"
        value={form.course}
        onChangeText={(v) => set("course", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email address"
        autoCapitalize="none"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(v) => set("email", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        value={form.password}
        onChangeText={(v) => set("password", v)}
      />

      <PrimaryButton
        title="Create account"
        onPress={submit}
        loading={busy}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F6F8FA",
  },
  heading: {
    fontSize: 25,
    fontWeight: "800",
    color: "#17324D",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 10,
    padding: 14,
    marginVertical: 7,
    fontSize: 15,
  },
});
