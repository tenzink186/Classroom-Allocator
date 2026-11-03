import React, { useEffect, useState } from "react";
import { Alert, Text, View, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import PrimaryButton from "../components/PrimaryButton";
import { CAMPUS_CENTER } from "../config/campus";
import { getCurrentLocation } from "../services/locationService";
import { getWalkingRoute } from "../services/directionsService";

export default function MapScreen({ route }) {
  const destination = route.params?.destination;
  const [current, setCurrent] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [busy, setBusy] = useState(false);

  async function locate() {
    try { const position = await getCurrentLocation(); setCurrent(position); }
    catch (e) { Alert.alert("Location unavailable", e.message); }
  }

  async function directions() {
    if (!destination || destination.latitude == null || destination.longitude == null) {
      return Alert.alert("Destination not configured", "Ask the administrator to add accurate GPS coordinates for this classroom/building.");
    }
    try {
      setBusy(true);
      const origin = current || await getCurrentLocation();
      setCurrent(origin);
      const points = await getWalkingRoute(origin, { latitude: destination.latitude, longitude: destination.longitude });
      setRoutePoints(points);
    } catch (e) { Alert.alert("Directions unavailable", e.message); }
    finally { setBusy(false); }
  }

  useEffect(() => { locate(); }, []);

  const initialRegion = current ? { ...current, latitudeDelta: 0.004, longitudeDelta: 0.004 } : CAMPUS_CENTER;

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion} showsUserLocation showsMyLocationButton>
        {current && <Marker coordinate={current} title="Your current location" pinColor="blue" />}
        {destination?.latitude != null && destination?.longitude != null &&
          <Marker coordinate={{ latitude: destination.latitude, longitude: destination.longitude }}
            title={destination.classroomNumber} description={destination.building} />}
        {routePoints.length > 0 && <Polyline coordinates={routePoints} strokeWidth={5} strokeColor="#1677D2" />}
      </MapView>
      <View style={styles.panel}>
        <Text style={styles.destination}>{destination ? `Destination: ${destination.classroomNumber} · ${destination.building}` : "CST Campus Map"}</Text>
        <PrimaryButton title="Refresh my location" secondary onPress={locate} />
        {destination && <PrimaryButton title="Show walking route" onPress={directions} loading={busy} />}
        <Text style={styles.hint}>Outdoor routing only. Indoor classroom floors are shown in classroom details.</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  panel: { padding: 12, backgroundColor: "#fff" },
  destination: { fontWeight: "700", color: "#17324D", marginBottom: 4 },
  hint: { color: "#667085", fontSize: 12, marginTop: 5 },
});
