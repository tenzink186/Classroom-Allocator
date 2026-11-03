
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
                role: "student",
                email: firebaseUser.email,
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

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
