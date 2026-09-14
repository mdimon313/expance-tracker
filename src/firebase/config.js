import { initializeApp, getApps, getApp } from "firebase/app";

import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";

import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

import { getStorage } from "firebase/storage";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};

// Temporary production debugging
console.log("🔥 Firebase Config Check", {
  apiKey: firebaseConfig.apiKey ? "PRESENT" : "MISSING",
  authDomain: firebaseConfig.authDomain ? "PRESENT" : "MISSING",
  projectId: firebaseConfig.projectId ? "PRESENT" : "MISSING",
  storageBucket: firebaseConfig.storageBucket ? "PRESENT" : "MISSING",
  messagingSenderId: firebaseConfig.messagingSenderId ? "PRESENT" : "MISSING",
  appId: firebaseConfig.appId ? "PRESENT" : "MISSING",
});

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});

export const storage = getStorage(app);

export default app;
