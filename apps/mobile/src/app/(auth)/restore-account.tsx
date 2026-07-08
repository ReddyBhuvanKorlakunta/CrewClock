import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { supabase } from "@/lib/supabase";

export default function RestoreAccountScreen() {
  const router = useRouter();
  const [error, setError] = useState("");
  const restore = trpc.account.restore.useMutation();

  async function handleRestore() {
    setError("");
    try {
      await restore.mutateAsync();
      router.replace("/(tabs)");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Couldn't restore your account");
    }
  }

  async function handleKeepDeleted() {
    await supabase.auth.signOut();
    router.replace("/(auth)/sign-in");
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-neutral-950">
      <Text className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">Restore your account?</Text>
      <Text className="mb-8 text-center text-sm text-neutral-500">
        This account was recently deleted. You can restore it within 7 days of deletion, or keep it deleted.
      </Text>
      {error ? <Text className="mb-4 text-sm text-red-500">{error}</Text> : null}
      <TouchableOpacity
        onPress={handleRestore}
        disabled={restore.isPending}
        className="mb-3 w-full items-center rounded-xl bg-blue-600 py-4 disabled:opacity-50"
      >
        {restore.isPending ? <ActivityIndicator color="white" /> : <Text className="font-semibold text-white">Restore my account</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleKeepDeleted} className="w-full items-center rounded-xl border border-neutral-200 py-4 dark:border-neutral-700">
        <Text className="font-semibold text-neutral-700 dark:text-neutral-200">Keep deleted</Text>
      </TouchableOpacity>
    </View>
  );
}
