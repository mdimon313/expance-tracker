import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Expo Notifications is used as the client-side layer. In production, push
// tokens should be stored on the user's Firestore profile
// (users/{userId}.pushToken) and delivered via Firebase Cloud Functions,
// which call the Expo Push API or FCM directly.

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") return null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: "#10B981",
    });
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
};

export const scheduleLocalNotification = (title, body, secondsFromNow = 1) =>
  Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { seconds: secondsFromNow },
  });
