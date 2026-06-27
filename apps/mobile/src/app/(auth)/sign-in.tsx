import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn() {
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      const result = await signIn.create({ identifier: email, password });
      await setActive({ session: result.createdSessionId });
      router.replace("/(tabs)");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-2 text-3xl font-bold text-blue-600">CrewClock</Text>
        <Text className="mb-8 text-sm text-neutral-500">Sign in to your account</Text>
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
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading || !email || !password}
            className="mt-2 items-center rounded-xl bg-blue-600 py-4 disabled:opacity-50"
          >
            {loading ? <ActivityIndicator color="white" /> : <Text className="font-semibold text-white">Sign in</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
