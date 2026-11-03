// Uses Google Directions API to draw an outdoor route on the in-app map.
// Enable Directions API in Google Cloud and set EXPO_PUBLIC_GOOGLE_DIRECTIONS_KEY.
import { decode } from "@mapbox/polyline";

const KEY = process.env.EXPO_PUBLIC_GOOGLE_DIRECTIONS_KEY;

export async function getWalkingRoute(origin, destination) {
  if (!KEY) {
    throw new Error("Directions API key is missing. Configure EXPO_PUBLIC_GOOGLE_DIRECTIONS_KEY.");
  }
  const url =
    `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}` +
    `&destination=${destination.latitude},${destination.longitude}&mode=walking&key=${KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not contact the directions service.");
  const data = await response.json();
  if (data.status !== "OK" || !data.routes?.length) {
    throw new Error(data.error_message || "No outdoor walking route was found for this destination.");
  }
  const points = decode(data.routes[0].overview_polyline.points);
  return points.map(([latitude, longitude]) => ({ latitude, longitude }));
}
