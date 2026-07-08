import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, Link } from "expo-router";
import { supabase } from "@/lib/supabase";
import { signInWithOAuthProvider } from "@/lib/oauth";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendVisible, setResendVisible] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  async function handleSignIn() {
    setLoading(true);
    setError("");
    setResendVisible(false);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      if (signInError.message.toLowerCase().includes("email not confirmed")) {
        setError("Please verify your email before signing in.");
        setResendVisible(true);
      } else if (signInError.message.toLowerCase().includes("invalid login credentials")) {
        setError("Incorrect email or password.");
      } else {
        setError(signInError.message);
      }
      setLoading(false);
      return;
    }
    router.replace("/(tabs)"); // (tabs) layout redirects to onboarding/restore-account if needed
    setLoading(false);
  }

  async function handleResend() {
    await supabase.auth.resend({ type: "signup", email });
    setResendSent(true);
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    setError("");
    try {
      await signInWithOAuthProvider("google");
      router.replace("/(tabs)");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-2 text-3xl font-bold text-blue-600">CrewClock</Text>
        <Text className="mb-8 text-sm text-neutral-500">Sign in to your account</Text>

        <TouchableOpacity
          onPress={handleGoogle}
          disabled={googleLoading}
          className="mb-4 w-full flex-row items-center justify-center rounded-xl border border-neutral-200 py-3.5 dark:border-neutral-700 disabled:opacity-50"
        >
          {googleLoading ? <ActivityIndicator /> : <Text className="font-medium text-neutral-700 dark:text-neutral-200">Continue with Google</Text>}
        </TouchableOpacity>

        <View className="w-full space-y-3">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          />
          {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
          {resendVisible && (
            <TouchableOpacity onPress={handleResend} disabled={resendSent}>
              <Text className="text-sm font-medium text-blue-600">
                {resendSent ? "Verification email resent ✓" : "Resend verification email"}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading || !email || !password}
            className="mt-2 items-center rounded-xl bg-blue-600 py-4 disabled:opacity-50"
          >
            {loading ? <ActivityIndicator color="white" /> : <Text className="font-semibold text-white">Sign in</Text>}
          </TouchableOpacity>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity className="items-center py-2">
              <Text className="text-sm text-neutral-500">No account? <Text className="font-medium text-blue-600">Sign up</Text></Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
