
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { useAuth } from "../context/AuthContext";
import { uploadProfilePicture } from "../services/cloudinaryService";

import { useTheme } from "../context/ThemeContext";
export default function EditProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { user, profile, updateUserProfile } = useAuth();

  const [fullName, setFullName] = useState("");
  const [course, setCourse] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(profile?.name || "");
    setCourse(profile?.course || "");
  }, [profile]);

  const displayedImage =
    selectedImage?.uri || profile?.profilePicUrl || null;

  // Select a profile picture
  const chooseImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow ClassFind to access your photos."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const image = result.assets[0];

      console.log("Selected image URI:", image.uri);
      console.log("Base64 available:", !!image.base64);

      if (!image.base64) {
        Alert.alert(
          "Image error",
          "Could not generate image data. Please select another image."
        );
        return;
      }

      if (image.fileSize && image.fileSize > 5 * 1024 * 1024) {
        Alert.alert(
          "Image too large",
          "Please select an image smaller than 5 MB."
        );
        return;
      }

      // Preserve Base64 data for Cloudinary upload
      setSelectedImage({
        uri: image.uri,
        base64: image.base64,
        mimeType: image.mimeType || "image/jpeg",
        fileName: image.fileName,
        fileSize: image.fileSize,
      });

    } catch (error) {
      console.log("IMAGE PICKER ERROR:", error);

      Alert.alert(
        "Image selection failed",
        error.message || "Could not select image."
      );
    }
  };

  // Save profile information
  const saveProfile = async () => {
    if (!fullName.trim() || !course.trim()) {
      Alert.alert(
        "Missing information",
        "Please complete all fields."
      );
      return;
    }

    try {
      setSaving(true);

      let profilePicUrl = profile?.profilePicUrl || "";

      // Upload new image if one was selected
      if (selectedImage) {
        console.log("Starting Cloudinary upload...");

        profilePicUrl = await uploadProfilePicture(selectedImage);

        console.log("Cloudinary upload successful.");
      }

      // Update Firestore profile
      await updateUserProfile({
        name: fullName.trim(),
        course: course.trim(),
        profilePicUrl: profilePicUrl,
      });

      Alert.alert(
        "Success",
        "Your profile has been updated.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );

    } catch (error) {
      console.log("PROFILE UPDATE ERROR:", error);

      Alert.alert(
        "Update failed",
        error.message || "Could not update your profile."
      );

    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={23} color={colors.text} />
        <Text style={styles.backText}>Back to Profile</Text>
      </TouchableOpacity>

      <Text style={styles.heading}></Text>

      {/* <Text style={styles.subtitle}>
        Update your personal information
      </Text> */}

      {/* Profile Picture */}
      <View style={styles.pictureSection}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={chooseImage}
          disabled={saving}
        >
          {displayedImage ? (
            <Image
              source={{ uri: displayedImage }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={58} color={colors.icon} />
            </View>
          )}

          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={19} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={chooseImage}
          disabled={saving}
        >
          <Text style={styles.changePicture}>
            {selectedImage || profile?.profilePicUrl
              ? "Change Profile Picture"
              : "Add Profile Picture"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profile Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
          editable={!saving}
        />

        <Text style={styles.label}>Programme </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your programme"
          value={course}
          onChangeText={setCourse}
          editable={!saving}
        />

        <Text style={styles.label}>Student ID</Text>

        <TextInput
          style={[styles.input, styles.readOnly]}
          value={profile?.studentId || "Not available"}
          editable={false}
        />

        <Text style={styles.label}>Email Address</Text>

        <TextInput
          style={[styles.input, styles.readOnly]}
          value={profile?.email || user?.email || "Not available"}
          editable={false}
        />

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.disabledButton,
          ]}
          onPress={saveProfile}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name="save-outline"
                size={20}
                color="#FFFFFF"
              />

              <Text style={styles.saveButtonText}>
                Save Changes
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={saving}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 22,
    paddingBottom: 35,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  backText: {
    marginLeft: 8,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 5,
  },
  pictureSection: {
    alignItems: "center",
    marginVertical: 25,
  },
  avatarContainer: {
    position: "relative",
    width: 125,
    height: 125,
    marginBottom: 12,
  },
  avatar: {
    width: 125,
    height: 125,
    borderRadius: 63,
    backgroundColor: colors.accentSurface,
  },
  avatarPlaceholder: {
    width: 125,
    height: 125,
    borderRadius: 63,
    backgroundColor: colors.accentSurface,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    position: "absolute",
    right: 0,
    bottom: 2,
    backgroundColor: colors.primaryDark,
    width: 38,
    height: 38,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.background,
  },
  changePicture: {
    color: colors.icon,
    fontSize: 14,
    fontWeight: "700",
  },
  form: {
    marginTop: 5,
  },
  label: {
    color: colors.mutedText,
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    height: 50,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.mutedText,
  },
  readOnly: {
    backgroundColor: colors.secondarySurface,
    color: colors.secondaryText,
  },
  saveButton: {
    height: 52,
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    marginHorizontal: 80,
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.65,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 9,
  },
  cancelButton: {
    alignItems: "center",
    padding: 15,
    marginTop: 5,
  },
  cancelText: {
    color: colors.secondaryText,
    fontWeight: "600",
  },
});
