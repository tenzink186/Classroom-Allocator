import React, { useEffect, useState } from "react";
import {ActivityIndicator,Alert,ScrollView,StyleSheet,Text,TouchableOpacity,View,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getClassrooms } from "../services/classroomService";
import { useTheme } from "../context/ThemeContext";

export default function BuildingClassroomsScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { building } = route.params;

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const floorOrder = [
    "Ground Floor",
    "First Floor",
    "Second Floor",
    "Third Floor",
  ];

  function normalize(value) {
    return (value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  useEffect(() => {
    loadClassrooms();
  }, []);

  async function loadClassrooms() {
    try {
      setLoading(true);

      const data = await getClassrooms();

      const buildingClassrooms = data.filter(
        (item) =>
          normalize(item.building) === normalize(building.name)
      );

      setClassrooms(buildingClassrooms);
    } catch (error) {
      Alert.alert(
        "Unable to load classrooms",
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  // Group classrooms according to their floors.
  const groupedClassrooms = classrooms.reduce((groups, item) => {
    const floor = item.floor || "Floor not specified";

    if (!groups[floor]) {
      groups[floor] = [];
    }

    groups[floor].push(item);

    return groups;
  }, {});

  const floors = Object.keys(groupedClassrooms).sort((a, b) => {
    const indexA = floorOrder.indexOf(a);
    const indexB = floorOrder.indexOf(b);

    if (indexA === -1 && indexB === -1) {
      return a.localeCompare(b);
    }

    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  function openClassroom(classroom) {
    navigation.navigate("Details", {
      classroom,
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Building Header */}
        <View style={styles.header}>
          <View style={styles.buildingIcon}>
            <Ionicons
              name="business"
              size={35}
              color={colors.icon}
            />
          </View>

          <Text style={styles.buildingName}>
            {building.name}
          </Text>

          <Text style={styles.subtitle}>
            Select a floor and classroom
          </Text>

          <Text style={styles.total}>
            {classrooms.length} classroom(s) available
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.icon}
            style={styles.loader}
          />
        ) : classrooms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={42}
              color={colors.icon}
            />

            <Text style={styles.emptyTitle}>
              No classrooms found
            </Text>

            <Text style={styles.emptyText}>
              There are currently no classroom records for this building.
            </Text>
          </View>
        ) : (
          floors.map((floor) => (
            <View key={floor} style={styles.floorSection}>
              {/* Floor Heading */}
              <View style={styles.floorHeading}>
                <Ionicons
                  name="layers-outline"
                  size={21}
                  color={colors.text}
                />

                <Text style={styles.floorTitle}>
                  {floor}
                </Text>

                <View style={styles.floorCount}>
                  <Text style={styles.floorCountText}>
                    {groupedClassrooms[floor].length}
                  </Text>
                </View>
              </View>

              {/* Classroom Grid */}
              <View style={styles.classroomGrid}>
                {groupedClassrooms[floor]
                  .sort((a, b) =>
                    a.classroomNumber.localeCompare(
                      b.classroomNumber,
                      undefined,
                      { numeric: true }
                    )
                  )
                  .map((classroom, index) => (
                    <TouchableOpacity
                      key={
                        classroom.id ||
                        `${classroom.classroomNumber}-${index}`
                      }
                      style={styles.classroomCard}
                      activeOpacity={0.75}
                      onPress={() => openClassroom(classroom)}
                    >
                      <View style={styles.roomIcon}>
                        <Ionicons
                          name="school-outline"
                          size={24}
                          color={colors.icon}
                        />
                      </View>

                      <Text style={styles.roomName}>
                        {classroom.classroomNumber}
                      </Text>

                      <Text style={styles.roomLabel}>
                        Classroom
                      </Text>

                      <View style={styles.viewDetails}>
                        <Text style={styles.viewDetailsText}>
                          View details
                        </Text>

                        <Ionicons
                          name="chevron-forward"
                          size={14}
                          color={colors.icon}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 18,
    paddingBottom: 35,
  },

  header: {
    alignItems: "center",
    backgroundColor: colors.card,
    padding: 22,
    borderRadius: 16,
    marginBottom: 22,
    elevation: 2,
  },

  buildingIcon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  buildingName: {
    fontSize: 23,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },

  subtitle: {
    color: colors.secondaryText,
    fontSize: 14,
    marginTop: 7,
  },

  total: {
    color: colors.icon,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 12,
  },

  loader: {
    marginTop: 50,
  },

  emptyContainer: {
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    marginTop: 15,
  },

  emptyTitle: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 17,
    marginTop: 12,
  },

  emptyText: {
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 7,
    lineHeight: 21,
  },

  floorSection: {
    marginBottom: 25,
  },

  floorHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  floorTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 9,
    flex: 1,
  },

  floorCount: {
    backgroundColor: colors.accentSurface,
    borderRadius: 15,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },

  floorCountText: {
    color: colors.icon,
    fontSize: 12,
    fontWeight: "700",
  },

  classroomGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  classroomCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    elevation: 2,
    marginBottom: 2,
  },

  roomIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  roomName: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.text,
  },

  roomLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 4,
  },

  viewDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  viewDetailsText: {
    color: colors.icon,
    fontSize: 12,
    fontWeight: "700",
  },
});