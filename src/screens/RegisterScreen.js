import React, { useState } from "react";
import {Alert,ScrollView,Text,TextInput,StyleSheet,View} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { registerUser } from "../services/authService";
import { useTheme } from "../context/ThemeContext";
import { Picker } from "@react-native-picker/picker";

export default function RegisterScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    course: "",
    email: "",
    password: "",
  });

  const [busy, setBusy] = useState(false);

  const set = (key, value) => {
    setForm((old) => ({
      ...old,
      [key]: value,
    }));
  };

  async function submit() {
    if (Object.values(form).some((v) => !v.trim())) {
      return Alert.alert(
        "Missing information",
        "Please complete all fields."
      );
    }

    // Validate student ID format: must be exactly 8 digits and start with 022
    if (!/^022\d{5}$/.test(form.studentId)) {
      return Alert.alert(
        "Invalid Student ID",
        "Student ID must be exactly 8 digits and start with 022 (e.g. 02240156)."
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
      //after registration, reset navigation stack to prevent going back to Register screen and goes to Login screen
      navigation.reset({index: 0, routes: [{ name: "Login" }]});

    } catch (e) {
      Alert.alert(
        "Registration failed",
        e.message
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>
        Create your account
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full name"
        placeholderTextColor={colors.placeholder}
        autoCapitalize="words"
        value={form.name}
        onChangeText={(v) => set("name", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Student ID"
        placeholderTextColor={colors.placeholder}
        autoCapitalize="characters"
        value={form.studentId}
        onChangeText={(v) => set("studentId", v)}
      />

      <View style={styles.dropdown}>
        <Picker
          selectedValue={form.course}
          onValueChange={(value) => set("course", value)}
          style={{ color: colors.text }}
          dropdownIconColor={colors.text}
      >
        <Picker.Item label="Programme" value="" />
        <Picker.Item label="BE Information Technology" value="BE Information Technology" />
        <Picker.Item label="BE Civil Engineering" value="BE Civil Engineering" />
        <Picker.Item label="BE Electrical Engineering" value="BE Electrical Engineering" />
        <Picker.Item label="BE Electronics and Communication Engineering" value="BE Electronics and Communication Engineering" />
        <Picker.Item label="BE Mechanical Engineering" value="BE Mechanical Engineering" />
        <Picker.Item label="Architecture" value="Architecture" />
        <Picker.Item label="BE Geology" value="BE Geology" />
        <Picker.Item label="BE Water Resources Engineering" value="BE Water Resources Engineering" />
        <Picker.Item label="BE Instrumentation and Control" value="BE Instrumentation and Control" />
      </Picker>
    </View>
      
      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor={colors.placeholder}
        autoCapitalize="none"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(v) => set("email", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.placeholder}
        secureTextEntry
        autoCapitalize="none"
        value={form.password}
        onChangeText={(v) => set("password", v)}
      />

      <View style={styles.buttonContainer}>
        <PrimaryButton title="Create account" onPress={submit} loading={busy}/>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
  },

  heading: {
    fontSize: 25,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 20,
  },

  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    marginVertical: 7,
    fontSize: 15,
  },
  buttonContainer: {
    width: "50%",
    alignSelf: "left",
    marginTop: 5,
  },
  dropdown: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    marginVertical: 7,
    justifyContent: "center",
  },
});
