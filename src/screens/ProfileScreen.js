
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";

import { useTheme } from "../context/ThemeContext";
export default function ProfileScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);
  const { user, profile } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of ClassFind?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              await logoutUser();
            } catch (error) {
              Alert.alert("Logout failed", error.message);
            }
          },
        },
      ]
    );
  };

  const displayName = profile?.name || "User";
  const email = profile?.email || user?.email || "Not available";

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* <Text style={styles.headerTitle}></Text>
          <Text style={styles.headerSubtitle}>
            View your personal information
          </Text> */}
        </View>

        {/* Profile Picture and Name */}
        <View style={styles.profileSection}>
          {profile?.profilePicUrl ? (
            <Image
              source={{ uri: profile.profilePicUrl }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatar}>
              <Ionicons
                name="person"
                size={58}
                color={colors.icon}
              />
            </View>
          )}

          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.informationSection}>
          <Text style={styles.sectionTitle}>
            Personal Information
          </Text>

          {/* Full Name */}
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="person-outline"
                size={21}
                color={colors.icon}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{displayName}</Text>
            </View>
          </View>

          {/* Student ID */}
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="card-outline"
                size={21}
                color={colors.icon}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Student ID</Text>
              <Text style={styles.infoValue}>
                {profile?.studentId || "Not available"}
              </Text>
            </View>
          </View>

          {/* Course */}
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="school-outline"
                size={21}
                color={colors.icon}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Programme</Text>
              <Text style={styles.infoValue}>
                {profile?.course || "Not provided"}
              </Text>
            </View>
          </View>

          {/* Email */}
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="mail-outline"
                size={21}
                color={colors.icon}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{email}</Text>
            </View>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={colors.danger}
          />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons
            name="home-outline"
            size={22}
            color={colors.secondaryText}
          />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Map")}
        >
          <Ionicons
            name="location"
            size={22}
            color={colors.secondaryText}
          />
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons
            name="person"
            size={22}
            color={colors.primary}
          />
          <Text style={[styles.navText, styles.activeNavText]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingBottom: 25,
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 10,
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: colors.text,
  },

  headerSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 5,
  },

  themeRow: {
    marginHorizontal: 22,
    marginTop: 10,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  themeTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  themeLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },

  profileSection: {
    alignItems: "center",
    paddingVertical: 25,
  },

  avatar: {
    width: 115,
    height: 115,
    borderRadius: 58,
    backgroundColor: colors.accentSurface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 13,
  },

  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },

  profileEmail: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 5,
  },

  informationSection: {
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 14,
  },

  infoCard: {
    minHeight: 72,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 11,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.mutedText,
  },

 editButton: {
  height: 52,
  backgroundColor: colors.primaryDark,
  borderRadius: 12,
  marginHorizontal: 100, // Increased from 22
  marginTop: 17,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
},

  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 9,
  },

  logoutButton: {
    height: 52,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 100,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutButtonText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 9,
  },

  bottomNavigation: {
    height: 68,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.secondarySurface,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  navText: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 4,
  },

  activeNavText: {
    color: colors.text,
    fontWeight: "700",
  },
});
