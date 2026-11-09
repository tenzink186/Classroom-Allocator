import React, { useEffect, useState } from "react";
import {Alert,FlatList,Modal,Text,TextInput,View,StyleSheet,} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import ClassroomCard from "../components/ClassroomCard";
import {addClassroom,deleteClassroom,getClassrooms,updateClassroom,initializeClassrooms,} from "../services/classroomService";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const empty = {
  classroomNumber: "",
  building: "",
  floor: "",
  description: "",
  latitude: "",
  longitude: "",
};

export default function AdminScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { profile } = useAuth();

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [visible, setVisible] = useState(false);

  // Load classrooms from Firestore
  async function load() {
    try {
      const classrooms = await getClassrooms();
      setItems(classrooms);
    } catch (error) {
      console.log("LOAD CLASSROOMS ERROR:", error);

      Alert.alert(
        "Unable to load classrooms",
        error.message ||
          "Please check your internet connection and Firestore permissions."
      );
    }
  }

  // Initialize Firestore classroom data
  useEffect(() => {
    if (profile?.role !== "admin") {
      return;
    }

    async function setupClassrooms() {
      try {
        await initializeClassrooms();
        await load();
      } catch (error) {
        console.log("CLASSROOM INITIALIZATION ERROR:", error);

        Alert.alert(
          "Classroom setup failed",
          error.message || "Could not initialize classroom data."
        );
      }
    }

    setupClassrooms();
  }, [profile?.role]);

  // Restrict access to administrators
  if (profile?.role !== "admin") {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Administrator access is required.
        </Text>
      </View>
    );
  }

  // Open form for adding a classroom
  function startNew() {
    setEditing(null);
    setForm({ ...empty });
    setVisible(true);
  }

  // Open form for editing a classroom
  function startEdit(item) {
    setEditing(item.id);

    setForm({
      classroomNumber: item.classroomNumber || "",
      building: item.building || "",
      floor: item.floor || "",
      description: item.description || "",
      latitude:
        item.latitude == null ? "" : String(item.latitude),
      longitude:
        item.longitude == null ? "" : String(item.longitude),
    });

    setVisible(true);
  }

  // Save classroom
  async function save() {
    if (
      !form.classroomNumber.trim() ||
      !form.building.trim() ||
      !form.floor.trim()
    ) {
      Alert.alert(
        "Required fields",
        "Classroom number, building and floor are required."
      );
      return;
    }

    const data = {
      ...form,
      classroomNumber:
        form.classroomNumber.trim().toUpperCase(),
      building: form.building.trim(),
      floor: form.floor.trim(),
      description: form.description.trim(),
      latitude: form.latitude.trim()
        ? Number(form.latitude)
        : null,
      longitude: form.longitude.trim()
        ? Number(form.longitude)
        : null,
    };

    if (
      (data.latitude !== null &&
        !Number.isFinite(data.latitude)) ||
      (data.longitude !== null &&
        !Number.isFinite(data.longitude))
    ) {
      Alert.alert(
        "Invalid coordinates",
        "Enter valid numeric latitude and longitude."
      );
      return;
    }

    try {
      if (editing !== null) {
        await updateClassroom(editing, data);
      } else {
        await addClassroom(data);
      }

      setVisible(false);
      setEditing(null);
      setForm({ ...empty });

      await load();

      Alert.alert(
        "Success",
        "Classroom information saved successfully."
      );
    } catch (error) {
      console.log("CLASSROOM SAVE ERROR:", error);

      Alert.alert(
        "Save failed",
        error.message ||
          "Unable to save classroom information."
      );
    }
  }

  // Delete classroom
  function remove(item) {
    Alert.alert(
      "Delete classroom",
      `Delete ${item.classroomNumber}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
            try {
              await deleteClassroom(item.id);
              await load();

              Alert.alert(
                "Success",
                "Classroom deleted successfully."
              );
            } catch (error) {
              console.log("CLASSROOM DELETE ERROR:", error);

              Alert.alert(
                "Delete failed",
                error.message ||
                  "Unable to delete classroom."
              );
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <PrimaryButton
        title="Add classroom"
        onPress={startNew}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.message}>
            No classrooms found. Check your Firestore classroom data.
          </Text>
        }
        renderItem={({ item }) => (
          <View>
            <ClassroomCard
              item={item}
              onPress={() => startEdit(item)}
            />

            <View style={styles.actions}>
              <Text
                style={styles.action}
                onPress={() => startEdit(item)}
              >
                Edit
              </Text>

              <Text
                style={styles.delete}
                onPress={() => remove(item)}
              >
                Delete
              </Text>
            </View>
          </View>
        )}
      />

      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modal}>
          <Text style={styles.heading}>
            {editing !== null
              ? "Update classroom"
              : "Add classroom"}
          </Text>

          {[
            ["classroomNumber", "Classroom number (e.g. IT3)"],
            ["building", "Building name"],
            ["floor", "Floor"],
            ["description", "Description"],
            ["latitude", "Latitude (GPS decimal)"],
            ["longitude", "Longitude (GPS decimal)"],
          ].map(([key, label]) => (
            <TextInput
              key={key}
              style={styles.input}
              placeholder={label}
              placeholderTextColor={colors.placeholder}
              keyboardType={
                key === "latitude" ||
                key === "longitude"
                  ? "decimal-pad"
                  : "default"
              }
              value={form[key]}
              onChangeText={(value) =>
                setForm((old) => ({
                  ...old,
                  [key]: value,
                }))
              }
            />
          ))}

          <Text style={styles.hint}>
            Use verified GPS coordinates for the building
            entrance or destination.
          </Text>

          <PrimaryButton
            title="Save"
            onPress={save}
          />

          <PrimaryButton
            title="Cancel"
            secondary
            onPress={() => setVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },

    message: {
      color: colors.text,
      marginTop: 16,
      textAlign: "center",
    },

    actions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 20,
      marginBottom: 10,
      marginRight: 8,
    },

    action: {
      color: colors.primary,
      fontWeight: "700",
    },

    delete: {
      color: colors.danger,
      fontWeight: "700",
    },

    modal: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
      backgroundColor: colors.background,
    },

    heading: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 14,
    },

    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 9,
      padding: 12,
      marginVertical: 5,
      color: colors.text,
    },

    hint: {
      color: colors.secondaryText,
      fontSize: 12,
      marginVertical: 8,
    },
  });
