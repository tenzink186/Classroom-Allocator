
import React from "react";
import {View,Text,ScrollView,TouchableOpacity,StyleSheet,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const BUILDINGS = [
  {
    id: "academic",
    name: "Academic Block",
    icon: "school-outline",
    description: "Ground Floor · CR1–CR9\nFirst Floor · CR10–CR14",
  },
  {
    id: "it",
    name: "IT Building",
    icon: "desktop-outline",
    description: "Ground, First and Second Floors",
  },
  {
    id: "architecture",
    name: "Architecture Building",
    icon: "color-palette-outline",
    description: "First and Second Floors",
  },
  {
    id: "lt1",
    name: "Lecture Theatre 1 (LT1)",
    icon: "easel-outline",
    description: "Ground Floor · LT1",
  },
  {
    id: "lt2",
    name: "Lecture Theatre 2 (LT2)",
    icon: "easel-outline",
    description: "Ground Floor · LT2",
  },
  {
    id: "lt3",
    name: "Lecture Theatre 3 (LT3)",
    icon: "easel-outline",
    description: "Ground Floor · LT3",
  },
];

export default function BuildingsScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.heading}>Campus Buildings</Text>

      <Text style={styles.subtitle}>
        Select a building to view its classrooms.
      </Text>

      {BUILDINGS.map((building) => (
        <TouchableOpacity
          key={building.id}
          style={styles.buildingCard}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate("BuildingClassrooms", {
              building: building,
            })
          }
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={building.icon}
              size={30}
              color={colors.icon}
            />
          </View>

          <View style={styles.buildingInfo}>
            <Text style={styles.buildingName}>
              {building.name}
            </Text>

            <Text style={styles.description}>
              {building.description}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color={colors.icon}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 20,
    paddingBottom: 30,
  },

  heading: {
    fontSize: 25,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 22,
  },

  buildingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 15,
    marginBottom: 14,
    elevation: 3,
  },

  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  buildingInfo: {
    flex: 1,
  },

  buildingName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },

  description: {
    fontSize: 12,
    color: colors.secondaryText,
    lineHeight: 18,
  },
});
