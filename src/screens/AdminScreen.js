import React, { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Text, TextInput, View, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import ClassroomCard from "../components/ClassroomCard";
import { addClassroom, deleteClassroom, getClassrooms, updateClassroom } from "../services/classroomService";
import { useAuth } from "../context/AuthContext";

const empty = { classroomNumber: "", building: "", floor: "", description: "", latitude: "", longitude: "" };

export default function AdminScreen() {
  const { profile } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [visible, setVisible] = useState(false);

  async function load() {
    try { setItems(await getClassrooms()); } catch (e) { Alert.alert("Error", e.message); }
  }
  useEffect(() => { load(); }, []);

  if (profile?.role !== "admin") {
    return <View style={styles.container}><Text>Administrator access is required.</Text></View>;
  }

  function startNew() { setEditing(null); setForm(empty); setVisible(true); }
  function startEdit(item) {
    setEditing(item.id);
    setForm({ classroomNumber: item.classroomNumber || "", building: item.building || "", floor: item.floor || "",
      description: item.description || "", latitude: item.latitude == null ? "" : String(item.latitude),
      longitude: item.longitude == null ? "" : String(item.longitude) });
    setVisible(true);
  }

  async function save() {
    if (!form.classroomNumber.trim() || !form.building.trim() || !form.floor.trim()) {
      return Alert.alert("Required fields", "Classroom number, building and floor are required.");
    }
    const data = { ...form, classroomNumber: form.classroomNumber.trim().toUpperCase(),
      building: form.building.trim(), floor: form.floor.trim(),
      latitude: form.latitude.trim() ? Number(form.latitude) : null,
      longitude: form.longitude.trim() ? Number(form.longitude) : null };
    if ((data.latitude !== null && !Number.isFinite(data.latitude)) || (data.longitude !== null && !Number.isFinite(data.longitude))) {
      return Alert.alert("Invalid coordinates", "Enter valid numeric latitude and longitude.");
    }
    try {
      if (editing) await updateClassroom(editing, data); else await addClassroom(data);
      setVisible(false); await load();
    } catch (e) { Alert.alert("Save failed", e.message); }
  }

  function remove(item) {
    Alert.alert("Delete classroom", `Delete ${item.classroomNumber}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try { await deleteClassroom(item.id); await load(); } catch (e) { Alert.alert("Delete failed", e.message); }
      }},
    ]);
  }

  return (
    <View style={styles.container}>
      <PrimaryButton title="Add classroom" onPress={startNew} />
      <FlatList data={items} keyExtractor={(x) => x.id} renderItem={({ item }) => (
        <View>
          <ClassroomCard item={item} onPress={() => startEdit(item)} />
          <View style={styles.actions}>
            <Text style={styles.action} onPress={() => startEdit(item)}>Edit</Text>
            <Text style={styles.delete} onPress={() => remove(item)}>Delete</Text>
          </View>
        </View>
      )} />
      <Modal visible={visible} animationType="slide" onRequestClose={() => setVisible(false)}>
        <View style={styles.modal}>
          <Text style={styles.heading}>{editing ? "Update classroom" : "Add classroom"}</Text>
          {[
            ["classroomNumber", "Classroom number (e.g. IT3)"],
            ["building", "Building name"],
            ["floor", "Floor"],
            ["description", "Description"],
            ["latitude", "Latitude (GPS decimal)"],
            ["longitude", "Longitude (GPS decimal)"],
          ].map(([key, label]) => <TextInput key={key} style={styles.input} placeholder={label}
            keyboardType={key === "latitude" || key === "longitude" ? "decimal-pad" : "default"}
            value={form[key]} onChangeText={(v) => setForm((old) => ({ ...old, [key]: v }))} />)}
          <Text style={styles.hint}>Use verified GPS coordinates for the building entrance or destination.</Text>
          <PrimaryButton title="Save" onPress={save} />
          <PrimaryButton title="Cancel" secondary onPress={() => setVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F6F8FA" },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 20, marginBottom: 10, marginRight: 8 },
  action: { color: "#1677D2", fontWeight: "700" },
  delete: { color: "#C0392B", fontWeight: "700" },
  modal: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#F6F8FA" },
  heading: { fontSize: 24, fontWeight: "800", color: "#17324D", marginBottom: 14 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#D0D5DD", borderRadius: 9, padding: 12, marginVertical: 5 },
  hint: { color: "#667085", fontSize: 12, marginVertical: 8 },
});
