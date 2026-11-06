
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";

import ClassroomCard from "../components/ClassroomCard";
import { getClassrooms } from "../services/classroomService";
import {
  saveRecentSearch,
  getRecentSearches,
} from "../services/recentSearchService";

export default function SearchScreen({ navigation }) {
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

  async function open(item) {
    try {
      await saveRecentSearch(item);
      navigation.navigate("Details", { classroom: item });
    } catch (e) {
      Alert.alert("Error", "Could not save recent search.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Find a Classroom</Text>

      <TextInput
        style={styles.search}
        placeholder="Search classroom number or building..."
        value={term}
        onChangeText={setTerm}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />

      {!term && recent.length > 0 && (
        <>
          <Text style={styles.label}>Recent Searches</Text>

          {recent.map((item, index) => (
            <ClassroomCard
              key={`recent-${item.id || index}`}
              item={item}
              onPress={() => open(item)}
            />
          ))}
        </>
      )}

      <Text style={styles.label}>
        {term ? `Search Results (${filtered.length})` : "All Classrooms"}
      </Text>

      {loading ? (
        <Text style={styles.message}>Loading classrooms...</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item, index) => item.id || String(index)}
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
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F6F8FA",
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#17324D",
    marginBottom: 14,
  },
  search: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  label: {
    fontWeight: "700",
    fontSize: 16,
    color: "#17324D",
    marginVertical: 8,
  },
  message: {
    color: "#667085",
    marginTop: 10,
  },
});
