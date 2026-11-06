
import * as Location from "expo-location";

export async function getCurrentLocation() {
  const permission =
    await Location.requestForegroundPermissionsAsync();

  if (permission.status !== "granted") {
    throw new Error("Please allow location access.");
  }

  // Get actual GPS location
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  const coordinates = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };

  // Convert GPS coordinates into a readable address
  let address = null;

  try {
    const results = await Location.reverseGeocodeAsync(coordinates);

    if (results.length > 0) {
      const place = results[0];

      address = [
        place.name,
        place.street,
        place.district,
        place.city,
        place.region,
        place.country,
      ]
        .filter(Boolean)
        .filter((value, index, array) => array.indexOf(value) === index)
        .join(", ");
    }
  } catch (error) {
    console.log("Address lookup failed:", error.message);
  }

  return {
    ...coordinates,
    address: address || "Address unavailable",
  };
}
