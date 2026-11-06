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
  // Academic Block - Ground Floor
  ...["CR1", "CR2", "CR3", "CR4", "CR5", "CR6", "CR7", "CR8", "CR9"].map(
    (classroom) => ({
      classroomNumber: classroom,
      building: "Academic Block",
      floor: "Ground Floor",
      description: `${classroom} - Academic Block`,
      latitude: 26.849333,
      longitude: 89.392544,
    })
  ),

  // Academic Block - First Floor
  ...["CR10", "CR11", "CR12", "CR13", "CR14"].map(
    (classroom) => ({
      classroomNumber: classroom,
      building: "Academic Block",
      floor: "First Floor",
      description: `${classroom} - Academic Block`,
      latitude: 26.849333,
      longitude: 89.392544,
    })
  ),

  // IT Building - Ground Floor
  ...["IT01", "IT02", "IT03"].map((classroom) => ({
    classroomNumber: classroom,
    building: "IT Building",
    floor: "Ground Floor",
    description: `${classroom} - IT Building`,
    latitude: 26.849519,
    longitude: 89.392073,
  })),

  // IT Building - First Floor
  ...["IT04", "IT05"].map((classroom) => ({
    classroomNumber: classroom,
    building: "IT Building",
    floor: "First Floor",
    description: `${classroom} - IT Building`,
    latitude: 26.849519,
    longitude: 89.392073,
  })),

  // IT Building - Second Floor
  {
    classroomNumber: "IT06",
    building: "IT Building",
    floor: "Second Floor",
    description: "IT06 - IT Building",
    latitude: 26.849519,
    longitude: 89.392073,
  },

    // Architecture Building - First Floor
  ...["CR17", "CR18"].map((classroom) => ({
    classroomNumber: classroom,
    building: "Architecture Building",
    floor: "First Floor",
    description: `${classroom} - Architecture Building`,
    latitude: 26.849550,
    longitude: 89.394355,
  })),

  // Architecture Building - Second Floor
  ...["CR15", "CR16", "Drawing Studio 1", "Drawing Studio 2", "Drawing Studio 3"].map(
    (classroom) => ({
      classroomNumber: classroom,
      building: "Architecture Building",
      floor: "Second Floor",
      description: `${classroom} - Architecture Building`,
      latitude: 26.849550,
      longitude: 89.394355,
    })
  ),
  ...["LT1"].map((classroom) => ({
    classroomNumber: classroom,
    building: "Lecture Theatre 1 (LT1)",
    floor: "Ground Floor",
    description: `${classroom} - Lecture Theatre 1`,
    latitude: 26.851059,
    longitude: 89.393636,
  })),
  ...["LT2"].map((classroom) => ({
    classroomNumber: classroom,
    building: "Lecture Theatre 2 (LT2)",
    floor: "Ground Floor",
    description: `${classroom} - Lecture Theatre 2`,
    latitude: 26.849738,
    longitude: 89.392017,
  })),
  ...["LT3"].map((classroom) => ({
    classroomNumber: classroom,
    building: "Lecture Theatre 3 (LT3)",
    floor: "Ground Floor",
    description: `${classroom} - Lecture Theatre 3`,
    latitude: 26.849894,
    longitude: 89.391997,
  }))
];


// Verified campus building coordinates
// CST campus building coordinates
// CST campus building coordinates
export const CAMPUS_BUILDINGS = [
  {
    id: "academic",
    name: "Academic Block",
    latitude: 26.849333,
    longitude: 89.392544,
  },
  {
    id: "it",
    name: "IT Building",
    latitude: 26.849519,
    longitude: 89.392073,
  },
  {
    id: "lt1",
    name: "Lecture Theatre 1 (LT1)",
    latitude: 26.851059,
    longitude: 89.393636,
  },
  {
    id: "lt2",
    name: "Lecture Theatre 2 (LT2)",
    latitude: 26.849738,
    longitude: 89.392017,
  },
  {
    id: "lt3",
    name: "Lecture Theatre 3 (LT3)",
    latitude: 26.849894,
    longitude: 89.391997,
  },
  {
    id: "architecture",
    name: "Architecture Building",
    latitude: 26.849550,
    longitude: 89.394355,
  },
];