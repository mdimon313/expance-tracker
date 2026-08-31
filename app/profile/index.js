import { Redirect } from "expo-router";
export default function ProfileRedirect() {
  // Profile editing lives inside Settings > Profile card.
  return <Redirect href="/(tabs)/settings" />;
}
