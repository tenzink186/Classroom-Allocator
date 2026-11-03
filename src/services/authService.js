import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export async function registerUser({ name, studentId, email, password }) {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await setDoc(doc(db, "users", credential.user.uid), {
    name: name.trim(),
    studentId: studentId.trim(),
    email: email.trim().toLowerCase(),
    role: "student",
    createdAt: new Date().toISOString(),
  });
  return credential.user;
}

export async function loginUser(identifier, password) {
  const value = identifier.trim().toLowerCase();
  let email = value;

  // Permit login by student ID as well as email.
  if (!value.includes("@")) {
    const q = query(collection(db, "users"), where("studentId", "==", identifier.trim()));
    const result = await getDocs(q);
    if (result.empty) throw new Error("No account was found for that student ID.");
    email = result.docs[0].data().email;
  }
  return signInWithEmailAndPassword(auth, email, password);
}

export const logoutUser = () => signOut(auth);

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}
