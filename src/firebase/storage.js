import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

export const uploadProfilePhoto = async (userId, blob) => {
  const fileRef = ref(storage, `users/${userId}/profile.jpg`);
  await uploadBytes(fileRef, blob);
  return getDownloadURL(fileRef);
};

export const deleteProfilePhoto = async (userId) => {
  const fileRef = ref(storage, `users/${userId}/profile.jpg`);
  try {
    await deleteObject(fileRef);
  } catch (e) {
    // ignore if it doesn't exist
  }
};
