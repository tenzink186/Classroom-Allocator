
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,sendPasswordResetEmail,} from "firebase/auth";
import {doc,setDoc,getDoc,query,collection,where,getDocs,} from "firebase/firestore";
import { auth, db } from "../config/firebase";

// REGISTER NEW STUDENT
export async function registerUser({
  name,
  studentId,
  course,
  email,
  password,
}) {
  const cleanEmail = email.trim().toLowerCase();

  const credential = await createUserWithEmailAndPassword(
    auth,
    cleanEmail,
    password
  );

  try {
    await setDoc(doc(db, "users", credential.user.uid), {
      name: name.trim(),
      studentId: studentId.trim(),
      course: course.trim(),
      email: cleanEmail,
      role: "student",
      createdAt: new Date().toISOString(),
    });
  } finally {
    // Sign out after registration so the student must log in manually.
    await signOut(auth);
  }

  return credential.user;
}

// LOGIN USING EMAIL OR STUDENT ID
export async function loginUser(identifier, password) {
  const value = identifier.trim().toLowerCase();
  let email = value;

  if (!value.includes("@")) {
    const q = query(
      collection(db, "users"),
      where("studentId", "==", identifier.trim())
    );

    const result = await getDocs(q);

    if (result.empty) {
      throw new Error("No account was found for that student ID.");
    }

    email = result.docs[0].data().email;
  }

  return signInWithEmailAndPassword(auth, email, password);
}

// SEND PASSWORD RESET EMAIL
export async function resetPassword(email) {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    throw new Error("Please enter your registered email address.");
  }

  return sendPasswordResetEmail(auth, cleanEmail);
}

// LOGOUT
export const logoutUser = () => signOut(auth);

// GET USER PROFILE
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));

  return snap.exists() ? snap.data() : null;
}
