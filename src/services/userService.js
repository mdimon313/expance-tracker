import { setDoc, updateDoc, getDoc, userDoc, withTimestamps } from "../firebase/firestore";
import { requireCurrentUser } from "../firebase/auth";

export const createUserProfile = async (userId, profileData) => {
  await setDoc(userDoc(userId), withTimestamps({ ...profileData }, true));
};

export const getUserProfile = async (userId) => {
  const snap = await getDoc(userDoc(userId));
  return snap.exists() ? snap.data() : null;
};

export const updateUserProfile = async (updates) => {
  const user = requireCurrentUser();
  await updateDoc(userDoc(user.uid), withTimestamps(updates));
};

export const updateUserCurrency = (currency) => updateUserProfile({ currency });
export const updateUserLanguage = (language) => updateUserProfile({ language });
export const updateUserTheme = (theme) => updateUserProfile({ theme });
