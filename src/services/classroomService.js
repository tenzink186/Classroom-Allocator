import {addDoc,collection,deleteDoc,doc,getDocs,orderBy,query,updateDoc,writeBatch,} from "firebase/firestore";
import { db } from "../config/firebase";
import { INITIAL_CLASSROOMS } from "../config/campus";

const classroomsRef = collection(db, "classrooms");

// Upload initial classroom data to Firestore if collection is empty
export async function initializeClassrooms() {
  const snapshot = await getDocs(classroomsRef);

  // Prevent duplicate uploads
  if (!snapshot.empty) {
    console.log("Classroom data already exists in Firestore.");
    return;
  }

  if (!INITIAL_CLASSROOMS || INITIAL_CLASSROOMS.length === 0) {
    console.log("No initial classroom data found.");
    return;
  }

  const batch = writeBatch(db);

  INITIAL_CLASSROOMS.forEach((classroom) => {
    const classroomDoc = doc(classroomsRef);

    batch.set(classroomDoc, {
      ...classroom,
      createdAt: new Date().toISOString(),
    });
  });

  await batch.commit();

  console.log("Initial classroom data uploaded successfully.");
}

// Get classrooms from Firestore
export async function getClassrooms() {
  const q = query(
    classroomsRef,
    orderBy("classroomNumber")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

// Add classroom
export async function addClassroom(data) {
  return addDoc(classroomsRef, {
    ...data,
    createdAt: new Date().toISOString(),
  });
}

// Update classroom
export async function updateClassroom(id, data) {
  if (!id) {
    throw new Error("A valid classroom document ID is required.");
  }

  return updateDoc(doc(db, "classrooms", id), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// Delete classroom
export async function deleteClassroom(id) {
  if (!id) {
    throw new Error("A valid classroom document ID is required.");
  }

  return deleteDoc(doc(db, "classrooms", id));
}
