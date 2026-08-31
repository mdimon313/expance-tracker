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

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth: use AsyncStorage-backed persistence on native so sessions survive app restarts.
export const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : (() => {
        try {
          return initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
          });
        } catch (e) {
          // initializeAuth throws if already initialized (e.g. Fast Refresh)
          return getAuth(app);
        }
      })();

// Firestore with offline persistence enabled (requirement #42 - offline support)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});

export const storage = getStorage(app);

export default app;
