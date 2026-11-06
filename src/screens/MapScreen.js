
import React, { useEffect, useRef, useState } from "react";

import {
  Alert,
  Linking,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import MapView, { Marker } from "react-native-maps";

import PrimaryButton from "../components/PrimaryButton";

import {
  CAMPUS_CENTER,
  CAMPUS_BUILDINGS,
} from "../config/campus";

import { getCurrentLocation } from "../services/locationService";

export default function MapScreen({ route }) {
  const destination = route.params?.destination;

  const [current, setCurrent] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [locating, setLocating] = useState(false);

  const mapRef = useRef(null);

  // Get the student's actual location and readable address
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

  // Get location automatically when map opens
  useEffect(() => {
    locate();
  }, []);

  // Zoom to the selected destination
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

    // Get current location if not already available
    if (!origin) {
      origin = await locate();

      if (!origin) {
        return;
      }
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

        {/* Student's Actual Location */}
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

        {/* Selected Classroom Destination */}
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

        {/* Readable Current Location */}
        <View style={styles.locationBox}>
          <Text style={styles.locationTitle}>
            <Text>📍 </Text>
            Your Current Location
          </Text>

          {locating ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#17324D" />
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

        <Text style={styles.hint}>
          Walking directions open in Google Maps.
          Indoor classroom floors are shown in classroom details.
        </Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  panel: {
    padding: 14,
    backgroundColor: "#FFFFFF",
  },

  destination: {
    fontWeight: "700",
    fontSize: 16,
    color: "#17324D",
    marginBottom: 10,
  },

  locationBox: {
    backgroundColor: "#EAF2FF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  locationTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#17324D",
    marginBottom: 6,
  },

  locationText: {
    fontSize: 14,
    color: "#344054",
    lineHeight: 21,
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  hint: {
    color: "#667085",
    fontSize: 12,
    marginTop: 8,
    lineHeight: 18,
  },
});
