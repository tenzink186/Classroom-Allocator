// IMPORTANT: Replace these sample coordinates with GPS coordinates collected at CST.
// Do not submit the app with guessed building coordinates.
// export const CAMPUS_CENTER = {
//   latitude: 0, // TODO: replace with verified CST campus latitude
//   longitude: 0, // TODO: replace with verified CST campus longitude
//   latitudeDelta: 0.004,
//   longitudeDelta: 0.004,
// };

export const CAMPUS_CENTER = {
  latitude: 26.85113,
  longitude: 89.39424,
  latitudeDelta: 0.004,
  longitudeDelta: 0.004,
};

// Add accurate coordinates for each building/classroom entrance or destination.
// Keep classroom floor information separate; outdoor GPS cannot locate indoor floors.
export const INITIAL_CLASSROOMS = [
  { classroomNumber: "CR1", building: "Academic Block", floor: "Ground Floor", description: "Classroom in Academic Block", latitude: null, longitude: null },
  { classroomNumber: "CR2", building: "Academic Block", floor: "Ground Floor", description: "Classroom in Academic Block", latitude: null, longitude: null },
  { classroomNumber: "IT1", building: "IT Building", floor: "Ground Floor", description: "Classroom in IT Building", latitude: null, longitude: null },
  { classroomNumber: "IT2", building: "IT Building", floor: "Ground Floor", description: "Classroom in IT Building", latitude: null, longitude: null },
  { classroomNumber: "LT1", building: "Lecture Theatre 1", floor: "Ground Floor", description: "Near FabLab", latitude: null, longitude: null },
  { classroomNumber: "LT2", building: "Lecture Theatre 2", floor: "Ground Floor", description: "Near IT Building", latitude: null, longitude: null },
  { classroomNumber: "LT3", building: "Lecture Theatre 3", floor: "Ground Floor", description: "Near IT Building", latitude: null, longitude: null },
  { classroomNumber: "CR15", building: "Architecture Building", floor: "Ground Floor", description: "Classroom in Architecture Building", latitude: null, longitude: null },
];
