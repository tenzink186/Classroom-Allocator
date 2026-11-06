
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_TbkUZVTv_ZIHLLJUET4jltQdjUG4EzA",
  authDomain: "classfindapp.firebaseapp.com",
  projectId: "classfindapp",
  storageBucket: "classfindapp.firebasestorage.app",
  messagingSenderId: "153727100258",
  appId: "1:153727100258:web:a656a2971a2a533a6bf83b",
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);

export default app;
