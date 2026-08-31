import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import {
  registerWithEmail,
  loginWithEmail,
  logout as fbLogout,
  resetPassword,
  updateAuthProfile,
  getCurrentUser,
} from "../firebase/auth";
import { createUserProfile } from "./userService";

const BIOMETRIC_ENABLED_KEY = "biometric_login_enabled";
const SESSION_TOKEN_KEY = "biometric_session_token"; // opaque token/preference only - never biometric data

export const register = async ({ fullName, email, password, currency }) => {
  const cred = await registerWithEmail(email, password);
  await updateAuthProfile({ displayName: fullName });
  await createUserProfile(cred.user.uid, {
    name: fullName,
    email,
    phone: "",
    photoURL: "",
    currency: currency || "BDT",
    language: "en",
    theme: "system",
  });
  return cred.user;
};

export const login = (email, password) => loginWithEmail(email, password);

export const logout = async () => {
  await disableBiometricLogin();
  await fbLogout();
};

export const forgotPassword = (email) => resetPassword(email);

// ---- Biometric login ----
// Only a secure session/login preference token is ever stored, via Expo
// SecureStore (OS-level Keychain/Keystore). No raw biometric data or
// templates are ever touched by the app.

export const getBiometricCapabilities = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  return { hasHardware, isEnrolled, types };
};

export const isBiometricLoginEnabled = async () => {
  const val = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
  return val === "true";
};

/**
 * Call after a successful Firebase email/password login when the user opts
 * in from Settings. Firebase persists its own session; we only store a
 * lightweight "biometric login is enabled" preference + a session marker.
 */
export const enableBiometricLogin = async () => {
  const user = getCurrentUser();
  if (!user) throw new Error("Must be logged in to enable biometric login.");

  const { hasHardware, isEnrolled } = await getBiometricCapabilities();
  if (!hasHardware || !isEnrolled) {
    throw new Error("Biometric authentication is not available on this device.");
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Confirm to enable biometric login",
    fallbackLabel: "Use passcode",
  });
  if (!result.success) throw new Error("Biometric confirmation failed.");

  await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, "true");
  // Store only a non-sensitive session marker (Firebase manages the real
  // auth token). This lets us know "this device may resume this user".
  await SecureStore.setItemAsync(SESSION_TOKEN_KEY, user.uid);
};

export const disableBiometricLogin = async () => {
  await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
  await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
};

/**
 * Prompts the native biometric dialog. On success, the caller should rely
 * on Firebase's own persisted session (already restored via
 * getReactNativePersistence) rather than any token from this function -
 * this only verifies local user presence.
 */
export const authenticateWithBiometrics = async () => {
  const enabled = await isBiometricLoginEnabled();
  if (!enabled) throw new Error("Biometric login is not enabled.");

  const { hasHardware, isEnrolled } = await getBiometricCapabilities();
  if (!hasHardware) throw new Error("This device has no biometric hardware.");
  if (!isEnrolled) throw new Error("No biometrics are enrolled on this device.");

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Log in to Expense Tracker",
    fallbackLabel: "Use password instead",
    cancelLabel: "Cancel",
  });

  if (!result.success) {
    const err = new Error(result.error === "user_cancel" ? "cancelled" : "failed");
    err.reason = result.error;
    throw err;
  }
  return true;
};
