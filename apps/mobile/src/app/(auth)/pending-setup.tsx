import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAccountState } from "@/lib/use-account-state";
import { supabase } from "@/lib/supabase";

export default function PendingSetupScreen() {
  const router = useRouter();
  const { session, accountStatus } = useAccountState();
  const [resent, setResent] = useState(false);

  const needsVerification = accountStatus === "email_pending_verification" || accountStatus === "new_user";

  async function handleResend() {
    if (!session?.user.email) return;
    await supabase.auth.resend({ type: "signup", email: session.user.email });
    setResent(true);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/(auth)/sign-in");
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-neutral-950">
      <Text className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">Almost there</Text>
      <Text className="mb-8 text-center text-sm text-neutral-500">
        {needsVerification
          ? "Please verify your email, then come back and sign in again."
          : "Finish setting up your workspace on the CrewClock web app before using the mobile app."}
      </Text>

      {needsVerification && (
        <TouchableOpacity onPress={handleResend} disabled={resent} className="mb-4">
          <Text className="text-sm font-medium text-blue-600">
            {resent ? "Verification email resent ✓" : "Resend verification email"}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={handleSignOut} className="w-full items-center rounded-xl border border-neutral-200 py-4 dark:border-neutral-700">
        <Text className="font-semibold text-neutral-700 dark:text-neutral-200">Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
