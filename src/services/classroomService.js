import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const classroomsRef = collection(db, "classrooms");

export async function getClassrooms() {
  const q = query(classroomsRef, orderBy("classroomNumber"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function addClassroom(data) {
  return addDoc(classroomsRef, { ...data, createdAt: new Date().toISOString() });
}

export async function updateClassroom(id, data) {
  return updateDoc(doc(db, "classrooms", id), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteClassroom(id) {
  return deleteDoc(doc(db, "classrooms", id));
}
