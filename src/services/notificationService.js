import { addDoc, getDocs, query, orderBy, userSubcollection, withTimestamps } from "../firebase/firestore";
import { requireCurrentUser } from "../firebase/auth";
import { scheduleLocalNotification } from "../firebase/messaging";

// Client-side notification log + local notification trigger.
// Production reminder/aggregation logic (debt due dates, budget crossing
// while app is closed) should run in a Firebase Cloud Function that writes
// to users/{userId}/notifications and sends an FCM push.

const COLLECTION = "notifications";

export const logNotification = async ({ title, body, type }) => {
  const user = requireCurrentUser();
  await addDoc(
    userSubcollection(user.uid, COLLECTION),
    withTimestamps({ userId: user.uid, createdBy: user.uid, title, body, type, read: false }, true)
  );
};

export const getNotifications = async () => {
  const user = requireCurrentUser();
  const q = query(userSubcollection(user.uid, COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const notifyBudgetThreshold = async (categoryName, percent) => {
  const title = percent >= 100 ? "Budget exceeded" : "Budget warning";
  const body =
    percent >= 100
      ? `You've exceeded your ${categoryName} budget.`
      : `You've reached ${percent}% of your ${categoryName} budget.`;
  await logNotification({ title, body, type: "budget" });
  await scheduleLocalNotification(title, body);
};
