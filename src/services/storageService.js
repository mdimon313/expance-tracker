import * as ImagePicker from "expo-image-picker";
import { uploadProfilePhoto } from "../firebase/storage";
import { updateUserProfile } from "./userService";
import { requireCurrentUser } from "../firebase/auth";

export const pickAndUploadProfilePhoto = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) throw new Error("permission_denied");

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });
  if (result.canceled) return null;

  const user = requireCurrentUser();
  const response = await fetch(result.assets[0].uri);
  const blob = await response.blob();
  const downloadURL = await uploadProfilePhoto(user.uid, blob);
  await updateUserProfile({ photoURL: downloadURL });
  return downloadURL;
};
