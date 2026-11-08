
import React, { useEffect, useMemo, useState } from "react";
import {Alert,FlatList,Text,TextInput,View,StyleSheet,TouchableOpacity,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ClassroomCard from "../components/ClassroomCard";
import { getClassrooms } from "../services/classroomService";
import {saveRecentSearch,getRecentSearches,clearRecentSearches,} from "../services/recentSearchService";
import { useTheme } from "../context/ThemeContext";

export default function SearchScreen({ navigation }) {

  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [items, setItems] = useState([]);
  const [recent, setRecent] = useState([]);
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const classrooms = await getClassrooms();
      setItems(classrooms);

      const searches = await getRecentSearches();
      setRecent(searches);

    } catch (e) {
      Alert.alert("Could not load classrooms", e.message);

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Normalize text so CR 17 and CR17 can match.
  const normalize = (value) =>
    (value || "").toLowerCase().replace(/\s+/g, "").trim();

  const filtered = useMemo(() => {
    const q = normalize(term);

    if (!q) return items;

    return items.filter((classroom) => {
      const classroomNumber = normalize(classroom.classroomNumber);
      const building = normalize(classroom.building);
      const floor = normalize(classroom.floor);
      const description = normalize(classroom.description);

      return (
        classroomNumber.includes(q) ||
        building.includes(q) ||
        floor.includes(q) ||
        description.includes(q)
      );
    });
  }, [items, term]);

  // Open classroom and save recent search
  async function open(item) {
    try {
      await saveRecentSearch(item);
      navigation.navigate("Details", { classroom: item });

    } catch (e) {
      Alert.alert("Error", "Could not save recent search.");
    }
  }

  // Clear all recent searches
  function confirmClearRecent() {
    Alert.alert(
      "Clear Recent Searches",
      "Are you sure you want to delete all recent searches?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await clearRecentSearches();
              setRecent([]);

              Alert.alert(
                "Success",
                "Recent searches have been cleared."
              );

            } catch (error) {
              Alert.alert(
                "Error",
                "Could not clear recent searches."
              );
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>

      {/* Heading */}
      <Text style={styles.heading}>
        Find a Classroom
      </Text>

      {/* Search Input */}
      <TextInput
        style={styles.search}
        placeholder="Search classroom number or building..."
        placeholderTextColor={colors.placeholder}
        value={term}
        onChangeText={setTerm}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />

      {/* Recent Searches */}
      {!term && recent.length > 0 && (
        <View style={styles.recentSection}>

          <View style={styles.recentHeader}>

            <Text style={styles.label}>
              Recent Searches
            </Text>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={confirmClearRecent}
            >
              <Ionicons
                name="trash-outline"
                size={15}
                color={colors.danger}
              />

              <Text style={styles.clearText}>
                Clear All
              </Text>
            </TouchableOpacity>

          </View>

          {/* Scrollable Recent Searches */}
          <FlatList
            data={recent}
            keyExtractor={(item, index) =>
              `recent-${item.id || index}`
            }
            renderItem={({ item }) => (
              <ClassroomCard
                item={item}
                onPress={() => open(item)}
              />
            )}
            style={styles.recentList}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          />

        </View>
      )}

      {/* All Classrooms / Search Results */}
      <Text style={styles.label}>
        {term
          ? `Search Results (${filtered.length})`
          : "All Classrooms"}
      </Text>

      {loading ? (
        <Text style={styles.message}>
          Loading classrooms...
        </Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item, index) =>
            item.id || String(index)
          }
          renderItem={({ item }) => (
            <ClassroomCard
              item={item}
              onPress={() => open(item)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.message}>
              No classrooms found. Try another classroom number or building name.
            </Text>
          }
          showsVerticalScrollIndicator={false}
          style={styles.classroomList}
        />
      )}

    </View>
  );
}


// Theme-aware styles
const createStyles = (colors) =>
  StyleSheet.create({

    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },

    heading: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 14,
    },

    search: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 14,
      marginBottom: 12,
      fontSize: 16,
      color: colors.text,
    },

    recentSection: {
      marginBottom: 8,
    },

    recentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    recentList: {
      maxHeight: 180,
    },

    clearButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      padding: 6,
    },

    clearText: {
      color: colors.danger,
      fontSize: 13,
      fontWeight: "600",
    },

    label: {
      fontWeight: "700",
      fontSize: 16,
      color: colors.text,
      marginVertical: 8,
    },

    classroomList: {
      flex: 1,
    },

    message: {
      color: colors.secondaryText,
      marginTop: 10,
    },

  });
