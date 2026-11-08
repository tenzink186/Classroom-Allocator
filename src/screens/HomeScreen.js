
import React from "react";
import {ScrollView,Text,StyleSheet,View,TextInput,TouchableOpacity,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function HomeScreen({ navigation }) {
  const { profile } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* Greeting */}
        <Text
          style={[
            styles.greeting,
            { color: colors.text },
          ]}
        >
          Kuzuzangpola, {profile?.name || "Student"} 👋
        </Text>

        <Text
          style={[
            styles.info,
            { color: colors.secondaryText },
          ]}
        >
          Where is your next classroom?
        </Text>

        {/* Search Bar */}
        <TouchableOpacity
          style={[
            styles.searchContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => navigation.navigate("Search")}
          activeOpacity={0.8}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.icon}
          />

          <TextInput
            style={[
              styles.searchInput,
              { color: colors.text },
            ]}
            placeholder="Search classroom or building..."
            placeholderTextColor={colors.placeholder}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>

        {/* Feature Cards */}
        <View style={styles.cardContainer}>

          {/* Find Classroom */}
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => navigation.navigate("Search")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="search-outline"
              size={32}
              color={colors.icon}
            />

            <Text
              style={[
                styles.cardTitle,
                { color: colors.text },
              ]}
            >
              Find Classroom
            </Text>
          </TouchableOpacity>

          {/* Campus Map */}
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => navigation.navigate("Map")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="map-outline"
              size={32}
              color={colors.icon}
            />

            <Text
              style={[
                styles.cardTitle,
                { color: colors.text },
              ]}
            >
              Campus Map
            </Text>
          </TouchableOpacity>

        </View>

        {/* Buildings Card */}
        <TouchableOpacity
          style={[
            styles.buildingCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => navigation.navigate("Buildings")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="business-outline"
            size={32}
            color={colors.icon}
          />

          <Text
            style={[
              styles.cardTitle,
              { color: colors.text },
            ]}
          >
            Buildings
          </Text>
        </TouchableOpacity>

        {/* Admin Button */}
        {profile?.role === "admin" && (
          <TouchableOpacity
            style={[
              styles.adminButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={() => navigation.navigate("Admin")}
          >
            <Text style={styles.adminText}>
              Manage Classrooms (Admin)
            </Text>
          </TouchableOpacity>
        )}

      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.border,
          },
        ]}
      >

        {/* Home */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <View
            style={[
              styles.activeIcon,
              { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons
              name="home"
              size={20}
              color="#FFFFFF"
            />
          </View>

          <Text
            style={[
              styles.activeLabel,
              { color: colors.primary },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* Map */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Map")}
        >
          <Ionicons
            name="location"
            size={22}
            color={colors.secondaryText}
          />

          <Text
            style={[
              styles.navLabel,
              { color: colors.secondaryText },
            ]}
          >
            Map
          </Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons
            name="person"
            size={21}
            color={colors.secondaryText}
          />

          <Text
            style={[
              styles.navLabel,
              { color: colors.secondaryText },
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({

  screen: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 35,
  },

  greeting: {
    fontSize: 27,
    fontWeight: "800",
    marginBottom: 8,
  },

  info: {
    fontSize: 15,
    marginBottom: 25,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 52,
    marginBottom: 20,
    borderWidth: 1,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
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
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    elevation: 3,
  },

  buildingCard: {
    height: 100,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    elevation: 3,
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
  },

  adminButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },

  adminText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  bottomNav: {
    height: 75,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    paddingBottom: 5,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  activeIcon: {
    paddingHorizontal: 17,
    paddingVertical: 5,
    borderRadius: 20,
  },

  navLabel: {
    fontSize: 11,
  },

  activeLabel: {
    fontSize: 11,
    fontWeight: "700",
  },

});
