
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";

export default function ProfileScreen({ navigation }) {
  const { profile } = useAuth();

  const [fullName, setFullName] = useState(profile?.name || "");
  const [course, setCourse] = useState(profile?.course || "B.E in IT");
  const [email, setEmail] = useState(profile?.email || "");
  
  const handleSave = () => {
    if (!fullName.trim() || !course.trim() || !email.trim()) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    Alert.alert(
      "Profile",
      "Profile details are ready. Connect your profile update service to save these changes."
    );
  };

  return (
    <View style={styles.screen}>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#17324D" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Edit Profile</Text>
          </View>

          {/* Profile Picture */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons
                name="person"
                size={55}
                color="#9296C4"
              />
            </View>

            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() =>
                Alert.alert(
                  "Profile Picture",
                  "Image upload functionality can be added next."
                )
              }
            >
              <Ionicons name="camera" size={19} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#98A2B3"
            />
          </View>

          {/* Course */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Course / Major</Text>
            <TextInput
              style={styles.input}
              value={course}
              onChangeText={setCourse}
              placeholder="Enter your course"
              placeholderTextColor="#98A2B3"
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#98A2B3"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              Save Changes
            </Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() =>
              Alert.alert("Log out", "Are you sure?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Log out",
                  style: "destructive",
                  onPress: logoutUser,
                },
              ])
            }
          >
            <Ionicons name="log-out-outline" size={19} color="#667085" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={21} color="#667085" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Map")}
        >
          <Ionicons name="location" size={22} color="#667085" />
          <Text style={styles.navLabel}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <View style={styles.activeIcon}>
            <Ionicons name="person" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.activeLabel}>Profile</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: "#F6F8FA",
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 25,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 35,
  },

  backButton: {
    marginRight: 15,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#17324D",
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  avatar: {
    width: 125,
    height: 125,
    borderRadius: 65,
    backgroundColor: "#EAE7F2",
    justifyContent: "center",
    alignItems: "center",
  },

  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: "29%",
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: "#9296C4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#F6F8FA",
  },

  inputContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#667085",
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#17324D",
    backgroundColor: "#FFFFFF",
  },

  saveButton: {
    height: 52,
    backgroundColor: "#9296C4",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    gap: 8,
    padding: 10,
  },

  logoutText: {
    color: "#667085",
    fontSize: 14,
    fontWeight: "600",
  },

  bottomNav: {
    height: 75,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E4E7EC",
    paddingBottom: 5,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  activeIcon: {
    backgroundColor: "#9296C4",
    paddingHorizontal: 17,
    paddingVertical: 5,
    borderRadius: 20,
  },

  navLabel: {
    fontSize: 11,
    color: "#667085",
  },

  activeLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9296C4",
  },

});
