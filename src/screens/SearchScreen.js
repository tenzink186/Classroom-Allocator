import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Text, TextInput, View, StyleSheet } from "react-native";
import ClassroomCard from "../components/ClassroomCard";
import { getClassrooms } from "../services/classroomService";
import { saveRecentSearch, getRecentSearches } from "../services/recentSearchService";

export default function SearchScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [recent, setRecent] = useState([]);
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try { setItems(await getClassrooms()); setRecent(await getRecentSearches()); }
    catch (e) { Alert.alert("Could not load classrooms", e.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return items;
    return items.filter((x) => [x.classroomNumber, x.building, x.floor].some((v) => (v || "").toLowerCase().includes(q)));
  }, [items, term]);

  async function open(item) {
    await saveRecentSearch(item);
    navigation.navigate("Details", { classroom: item });
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.search} placeholder="Search e.g. IT3 or IT Building" value={term} onChangeText={setTerm} />
      {!term && recent.length > 0 && <Text style={styles.label}>Recent searches</Text>}
      {!term && recent.map((item) => <ClassroomCard key={`r-${item.id}`} item={item} onPress={() => open(item)} />)}
      <Text style={styles.label}>Classrooms</Text>
      {loading ? <Text>Loading classrooms...</Text> :
        <FlatList data={filtered} keyExtractor={(item) => item.id} renderItem={({ item }) =>
          <ClassroomCard item={item} onPress={() => open(item)} />
        } ListEmptyComponent={<Text>No classrooms found. Try another classroom number or building.</Text>} />}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F6F8FA" },
  search: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#D0D5DD", borderRadius: 10, padding: 14, marginBottom: 12 },
  label: { fontWeight: "700", color: "#17324D", marginVertical: 8 },
});
