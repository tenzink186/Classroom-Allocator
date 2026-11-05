
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../config/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        setLoading(true);

        try {
          setUser(firebaseUser);

          if (firebaseUser) {
            const userRef = doc(db, "users", firebaseUser.uid);
            const snap = await getDoc(userRef);

            if (snap.exists()) {
              setProfile(snap.data());
            } else {
              setProfile({
                name: "",
                course: "",
                role: "student",
                email: firebaseUser.email || "",
              });
            }
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error("Authentication error:", error);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  // Update user profile in Firestore
  const updateUserProfile = async (updatedData) => {
    if (!user) {
      throw new Error("User is not logged in.");
    }

    try {
      const userRef = doc(db, "users", user.uid);

      await setDoc(userRef, updatedData, { merge: true });

      setProfile((previousProfile) => ({
        ...previousProfile,
        ...updatedData,
      }));

      return true;
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
