import { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

// Landed on after an OAuth (Google/Apple/Microsoft) redirect completes —
// expo-web-browser hands the callback URL's query params to this screen via
// the "crewclock://auth/callback" deep link.
export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ access_token?: string; refresh_token?: string }>();
  const [error, setError] = useState("");

  useEffect(() => {
    async function run() {
      if (!params.access_token || !params.refresh_token) {
        setError("Sign-in didn't complete. Please try again.");
        return;
      }
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: params.access_token,
        refresh_token: params.refresh_token,
      });
      if (sessionError) {
        setError(sessionError.message);
        return;
      }
      router.replace("/(auth)/sign-in"); // the (auth) layout redirects onward based on account state
    }
    run();
  }, [params.access_token, params.refresh_token]);

  return (
    <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-neutral-950">
      {error ? <Text className="text-sm text-red-500">{error}</Text> : <ActivityIndicator />}
    </View>
  );
}
