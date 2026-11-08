
import {addDoc,collection,deleteDoc,doc,getDocs,orderBy,query,updateDoc,} from "firebase/firestore";
import { db } from "../config/firebase";
import { INITIAL_CLASSROOMS } from "../config/campus";

const classroomsRef = collection(db, "classrooms");

export async function getClassrooms() {
  try {
    const q = query(classroomsRef, orderBy("classroomNumber"));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
    }
  } catch (error) {
    console.log("Using local classroom data:", error.message);
  }

  // Local classroom data
  return INITIAL_CLASSROOMS.map((item, index) => ({
    ...item,
    id: `local-${index + 1}`,
  }));
}

export async function addClassroom(data) {
  return addDoc(classroomsRef, {
    ...data,
    createdAt: new Date().toISOString(),
  });
}

export async function updateClassroom(id, data) {
  return updateDoc(doc(db, "classrooms", id), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteClassroom(id) {
  return deleteDoc(doc(db, "classrooms", id));
}
