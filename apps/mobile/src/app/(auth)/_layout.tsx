import { Redirect, Stack } from "expo-router";
import { useAccountState } from "@/lib/use-account-state";

export default function AuthLayout() {
  const { loading, session, accountStatus, onboardingCompleted } = useAccountState();
  if (loading) return null;

  if (session && accountStatus) {
    if (accountStatus === "soft_deleted") return <Redirect href="/(auth)/restore-account" />;
    if (accountStatus === "active" && onboardingCompleted) return <Redirect href="/(tabs)" />;
    if (accountStatus !== "disabled") return <Redirect href="/(auth)/pending-setup" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
