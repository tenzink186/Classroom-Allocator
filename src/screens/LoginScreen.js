import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, StyleSheet ,View,} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { loginUser } from "../services/authService";
import { useTheme } from "../context/ThemeContext";

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
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
      <TextInput style={styles.input} placeholder="Email or Student ID" placeholderTextColor={colors.placeholder} autoCapitalize="none" value={identifier} onChangeText={setIdentifier} />
      <TextInput style={styles.input} placeholder="Password"
        placeholderTextColor={colors.placeholder} secureTextEntry value={password} onChangeText={setPassword} />
      {/* <PrimaryButton title="Log in" onPress={handleLogin} loading={busy} />
      <PrimaryButton title="Create student account" secondary onPress={() => navigation.navigate("Register")} /> */}
      <View style={styles.buttonContainer}>
        <PrimaryButton title="Log in" onPress={handleLogin} loading={busy}/>
        <PrimaryButton title="Create account" secondary onPress={() => navigation.navigate("Register")}/>
      </View>
    </KeyboardAvoidingView>
  );
}
const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: colors.background },
  logo: { fontSize: 34, fontWeight: "800", color: colors.text, textAlign: "center" },
  subtitle: { textAlign: "center", color: colors.secondaryText, marginBottom: 30, marginTop: 8 },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 14, marginVertical: 7 },
  buttonContainer: {width: "40%",alignSelf: "left",marginTop: 5,},
});
