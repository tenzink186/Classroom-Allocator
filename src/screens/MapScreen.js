
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  Text,
  View,
  StyleSheet,
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

  // Get the student's current GPS location
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

  // Automatically get the student's location when the map opens
  useEffect(() => {
    locate();
  }, []);

  // Zoom to the selected classroom's building
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

  // Open Google Maps with walking directions
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

    // Make sure we have the student's current location
    let origin = current;

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
        "Please check that Google Maps or a web browser is available on your phone."
      );
    }
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={CAMPUS_CENTER}
        mapType="hybrid"
        showsUserLocation={true}
        showsMyLocationButton={true}
        onMapReady={() => setMapReady(true)}
      >
        {/* CST campus buildings */}
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

        {/* Student's current location */}
        {current && (
          <Marker
            coordinate={current}
            title="Your current location"
            pinColor="blue"
          />
        )}

        {/* Selected classroom destination */}
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

      <View style={styles.panel}>
        <Text style={styles.destination}>
          {destination
            ? `Destination: ${destination.classroomNumber} · ${destination.building}`
            : "CST Campus Map"}
        </Text>

        <Text style={styles.hint}>
          {current
            ? "Your current GPS location is available."
            : "Your current location has not been detected yet."}
        </Text>

        <PrimaryButton
          title={locating ? "Getting location..." : "Refresh my location"}
          secondary
          onPress={locate}
        />

        {destination && (
          <PrimaryButton
            title="Get Walking Directions"
            onPress={directions}
          />
        )}

        <Text style={styles.hint}>
          Walking directions open in Google Maps. Indoor classroom
          locations and floors are shown in classroom details.
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
    padding: 12,
    backgroundColor: "#fff",
  },

  destination: {
    fontWeight: "700",
    fontSize: 16,
    color: "#17324D",
    marginBottom: 4,
  },

  hint: {
    color: "#667085",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5,
    lineHeight: 18,
  },
});
