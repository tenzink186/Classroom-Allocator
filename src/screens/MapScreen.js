
import React, { useEffect, useRef, useState } from "react";
import {Alert,Linking,Text,View,StyleSheet,ActivityIndicator,TouchableOpacity,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import PrimaryButton from "../components/PrimaryButton";
import {CAMPUS_CENTER,CAMPUS_BUILDINGS,} from "../config/campus";
import { getCurrentLocation } from "../services/locationService";
import { useTheme } from "../context/ThemeContext";

export default function MapScreen({ route, navigation }) {

  const { colors } = useTheme();
  const styles = createStyles(colors);

  const destination = route.params?.destination;

  const [current, setCurrent] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [locating, setLocating] = useState(false);

  const mapRef = useRef(null);

  // Get student's current location
  async function locate() {
    try {
      setLocating(true);

      const position = await getCurrentLocation();

      setCurrent(position);

      return position;

    } catch (error) {
      Alert.alert("Location unavailable", error.message);
      return null;

    } finally {
      setLocating(false);
    }
  }

  // Automatically get location when map opens
  useEffect(() => {
    locate();
  }, []);

  // Zoom to selected destination
  useEffect(() => {
    if (
      mapReady &&
      destination?.latitude != null &&
      destination?.longitude != null
    ) {
      mapRef.current?.animateToRegion(
        {
          latitude: Number(destination.latitude),
          longitude: Number(destination.longitude),
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        },
        1000
      );
    }
  }, [mapReady, destination]);

  // Open Google Maps walking directions
  async function directions() {

    if (
      !destination ||
      !Number.isFinite(Number(destination.latitude)) ||
      !Number.isFinite(Number(destination.longitude))
    ) {
      Alert.alert(
        "Destination unavailable",
        "This classroom does not have valid GPS coordinates."
      );
      return;
    }

    let origin = current;

    if (!origin) {
      origin = await locate();

      if (!origin) return;
    }

    const latitude = Number(destination.latitude);
    const longitude = Number(destination.longitude);

    const url =
      "https://www.google.com/maps/dir/?api=1" +
      `&origin=${origin.latitude},${origin.longitude}` +
      `&destination=${latitude},${longitude}` +
      "&travelmode=walking";

    try {
      await Linking.openURL(url);

    } catch (error) {
      Alert.alert(
        "Could not open directions",
        "Please check that Google Maps or a web browser is available."
      );
    }
  }

  return (
    <View style={styles.container}>

      {/* Campus Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={CAMPUS_CENTER}
        mapType="hybrid"
        showsUserLocation={true}
        showsMyLocationButton={true}
        onMapReady={() => setMapReady(true)}
      >

        {/* CST Campus Buildings */}
        {CAMPUS_BUILDINGS.map((building) => (
          <Marker
            key={building.id}
            coordinate={{
              latitude: building.latitude,
              longitude: building.longitude,
            }}
            title={building.name}
            description="CST Campus Building"
          />
        ))}

        {/* Student's Current Location */}
        {current && (
          <Marker
            coordinate={{
              latitude: current.latitude,
              longitude: current.longitude,
            }}
            title="Your Current Location"
            description={current.address || "Current GPS location"}
            pinColor="blue"
          />
        )}

        {/* Selected Classroom */}
        {destination &&
          Number.isFinite(Number(destination.latitude)) &&
          Number.isFinite(Number(destination.longitude)) && (
            <Marker
              coordinate={{
                latitude: Number(destination.latitude),
                longitude: Number(destination.longitude),
              }}
              title={destination.classroomNumber}
              description={destination.building}
              pinColor="green"
            />
          )}

      </MapView>

      {/* Information Panel */}
      <View style={styles.panel}>

        <Text style={styles.destination}>
          {destination
            ? `Destination: ${destination.classroomNumber} · ${destination.building}`
            : "CST Campus Map"}
        </Text>

        {/* Current Location */}
        <View style={styles.locationBox}>

          <Text style={styles.locationTitle}>
            📍 Your Current Location
          </Text>

          {locating ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator
                size="small"
                color={colors.primary}
              />

              <Text style={styles.locationText}>
                Finding your location...
              </Text>
            </View>
          ) : (
            <Text style={styles.locationText}>
              {current
                ? current.address || "Address unavailable"
                : "Location not detected. Please refresh."}
            </Text>
          )}

        </View>

        {/* Refresh Location */}
        <PrimaryButton
          title={
            locating
              ? "Getting location..."
              : "Refresh My Location"
          }
          secondary
          onPress={locate}
        />

        {/* Walking Directions */}
        {destination && (
          <PrimaryButton
            title="Get Walking Directions"
            onPress={directions}
          />
        )}

      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>

        {/* Home */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons
            name="home-outline"
            size={23}
            color={colors.secondaryText}
          />

          <Text style={styles.navText}>
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
            size={23}
            color={colors.primary}
          />

          <Text style={[styles.navText, styles.activeNavText]}>
            Map
          </Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons
            name="person-outline"
            size={23}
            color={colors.secondaryText}
          />

          <Text style={styles.navText}>
            Profile
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}


// Styles
const createStyles = (colors) =>
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    map: {
      flex: 1,
    },

    panel: {
      padding: 10,
      backgroundColor: colors.card,
    },

    destination: {
      fontWeight: "700",
      fontSize: 16,
      color: colors.text,
      marginBottom: 10,
    },

    locationBox: {
      backgroundColor: colors.surface,
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },

    locationTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 6,
    },

    locationText: {
      fontSize: 14,
      color: colors.secondaryText,
      lineHeight: 21,
    },

    loadingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    hint: {
      color: colors.secondaryText,
      fontSize: 12,
      marginTop: 8,
      lineHeight: 18,
    },

    // Bottom Navigation
    bottomNavigation: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: colors.card,
      paddingVertical: 10,
      paddingBottom: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    navItem: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      paddingVertical: 4,
    },

    navText: {
      fontSize: 12,
      color: colors.secondaryText,
      fontWeight: "500",
    },

    activeNavText: {
      color: colors.primary,
      fontWeight: "700",
    },

  });
