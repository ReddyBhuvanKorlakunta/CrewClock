import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function VerifyEmailSentScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [sent, setSent] = useState(false);

  async function handleResend() {
    if (!email) return;
    await supabase.auth.resend({ type: "signup", email });
    setSent(true);
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-neutral-950">
      <Text className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">Check your email</Text>
      <Text className="mb-8 text-center text-sm text-neutral-500">
        {email ? `We sent a verification link to ${email}.` : "We sent you a verification link."} Verify your
        email, then come back and sign in.
      </Text>

      <TouchableOpacity
        onPress={() => router.replace("/(auth)/sign-in")}
        className="mb-3 w-full items-center rounded-xl bg-blue-600 py-4"
      >
        <Text className="font-semibold text-white">Go to sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleResend} disabled={sent || !email}>
        <Text className="text-sm font-medium text-blue-600">
          {sent ? "Verification email resent ✓" : "Resend verification email"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
