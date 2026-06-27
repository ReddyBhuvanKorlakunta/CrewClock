import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) return <Redirect href="/(tabs)" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
