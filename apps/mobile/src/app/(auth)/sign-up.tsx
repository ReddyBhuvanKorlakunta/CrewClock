import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, Link } from "expo-router";
import { supabase } from "@/lib/supabase";
import { signInWithOAuthProvider } from "@/lib/oauth";

export default function SignUpScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignUp() {
    setLoading(true);
    setError("");
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "crewclock://auth/callback",
          data: { first_name: firstName, last_name: lastName },
        },
      });
      if (signUpError) throw signUpError;
      if (data.user && data.user.identities?.length === 0) {
        setError("An account already exists with this email. Sign in or reset your password.");
        return;
      }
      router.push({ pathname: "/(auth)/verify-email-sent", params: { email } });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
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
        <Text className="mb-8 text-sm text-neutral-500">Create your account</Text>

        <TouchableOpacity
          onPress={handleGoogle}
          disabled={googleLoading}
          className="mb-4 w-full flex-row items-center justify-center rounded-xl border border-neutral-200 py-3.5 dark:border-neutral-700 disabled:opacity-50"
        >
          {googleLoading ? <ActivityIndicator /> : <Text className="font-medium text-neutral-700 dark:text-neutral-200">Continue with Google</Text>}
        </TouchableOpacity>

        <View className="w-full space-y-3">
          <View className="flex-row space-x-2">
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            />
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            />
          </View>
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
            placeholder="Password (min 8 characters)"
            secureTextEntry
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          />
          {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
          <TouchableOpacity
            onPress={handleSignUp}
            disabled={loading || !firstName || !lastName || !email || password.length < 8}
            className="mt-2 items-center rounded-xl bg-blue-600 py-4 disabled:opacity-50"
          >
            {loading ? <ActivityIndicator color="white" /> : <Text className="font-semibold text-white">Create account</Text>}
          </TouchableOpacity>
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity className="items-center py-2">
              <Text className="text-sm text-neutral-500">Already have an account? <Text className="font-medium text-blue-600">Sign in</Text></Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
