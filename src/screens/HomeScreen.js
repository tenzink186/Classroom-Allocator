
import React from "react";
import {
  Alert,
  ScrollView,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";

export default function HomeScreen({ navigation }) {
  const { profile } = useAuth();

  return (
    <View style={styles.screen}>

      <ScrollView contentContainerStyle={styles.container}>

        {/* Greeting */}
        <Text style={styles.greeting}>
          Hello, {profile?.name || "Student"} 👋
        </Text>

        <Text style={styles.info}>
          Where is your next classroom?
        </Text>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => navigation.navigate("Search")}
          activeOpacity={0.8}
        >
          <Ionicons name="search-outline" size={20} color="#9296C4" />

          <TextInput
            style={styles.searchInput}
            placeholder="Search classroom or building..."
            placeholderTextColor="#98A2B3"
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>

        {/* Feature Cards */}
        <View style={styles.cardContainer}>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Search")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="search-outline"
              size={32}
              color="#9296C4"
            />
            <Text style={styles.cardTitle}>
              Find Classroom
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Map")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="map-outline"
              size={32}
              color="#9296C4"
            />
            <Text style={styles.cardTitle}>
              Campus Map
            </Text>
          </TouchableOpacity>

        </View>

        {/* Buildings Card */}
        <TouchableOpacity
          style={styles.buildingCard}
          onPress={() => navigation.navigate("Map")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="business-outline"
            size={32}
            color="#9296C4"
          />
          <Text style={styles.cardTitle}>
            Buildings
          </Text>
        </TouchableOpacity>

        {/* Admin Button */}
        {profile?.role === "admin" && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate("Admin")}
          >
            <Text style={styles.adminText}>
              Manage Classrooms (Admin)
            </Text>
          </TouchableOpacity>
        )}

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
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>

        {/* Home */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <View style={styles.activeIcon}>
            <Ionicons name="home" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.activeLabel}>Home</Text>
        </TouchableOpacity>

        {/* Map */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Map")}
        >
          <Ionicons
            name="location"
            size={22}
            color="#667085"
          />
          <Text style={styles.navLabel}>Map</Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons
            name="person"
            size={21}
            color="#667085"
          />
          <Text style={styles.navLabel}>Profile</Text>
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
    padding: 20,
    paddingTop: 35,
  },

  greeting: {
    fontSize: 27,
    fontWeight: "800",
    color: "#17324D",
    marginBottom: 8,
  },

  info: {
    color: "#667085",
    fontSize: 15,
    marginBottom: 25,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 52,
    marginBottom: 20,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#17324D",
  },

  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },

  card: {
    flex: 1,
    height: 145,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  buildingCard: {
    height: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#667085",
    marginTop: 12,
  },

  adminButton: {
    backgroundColor: "#9296C4",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },

  adminText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  logoutButton: {
    padding: 14,
    alignItems: "center",
  },

  logoutText: {
    color: "#667085",
    fontSize: 14,
    fontWeight: "600",
  },

  // Bottom Navigation
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
