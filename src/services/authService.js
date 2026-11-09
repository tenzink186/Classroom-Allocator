
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,sendPasswordResetEmail,} from "firebase/auth";
import {doc,setDoc,getDoc,query,collection,where,getDocs,} from "firebase/firestore";
import { auth, db } from "../config/firebase";

// REGISTER NEW STUDENT
export async function registerUser({name,studentId,course,email,password,}) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanStudentId = studentId.trim();

  const credential = await createUserWithEmailAndPassword(
    auth,
    cleanEmail,
    password
  );

  try {
    await setDoc(doc(db, "users", credential.user.uid), {
      name: name.trim(),
      studentId: cleanStudentId,
      course: course.trim(),
      email: cleanEmail,
      role: "student",
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.log("PROFILE CREATION ERROR:", error.code, error.message);
    throw error;
  } finally {
    await signOut(auth);
  }

  return credential.user;
}

// LOGIN USING EMAIL OR STUDENT ID
export async function loginUser(identifier, password) {
  const value = identifier.trim();

  if (!value || !password) {
    throw new Error("Please enter your login information.");
  }

  let email = value.toLowerCase();

  // If the input is not an email, search by student ID
  if (!value.includes("@")) {
    const q = query(
      collection(db, "users"),
      where("studentId", "==", value)
    );

    const result = await getDocs(q);

    if (result.empty) {
      throw new Error(
        "No account was found for that student ID."
      );
    }

    email = result.docs[0].data().email;
  }

  return signInWithEmailAndPassword(
    auth,
    email,
    password
  );
}

// RESET PASSWORD
export async function resetPassword(email) {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    throw new Error(
      "Please enter your registered email address."
    );
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
