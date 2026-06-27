import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { LogOut, Bell, Moon, Shield, HelpCircle, ChevronRight } from "lucide-react-native";

const MENU_ITEMS = [
  { icon: Bell, label: "Notifications", hint: "Shift alerts & reminders" },
  { icon: Moon, label: "Appearance", hint: "Light / dark / system" },
  { icon: Shield, label: "Privacy & security", hint: "Biometrics, data export" },
  { icon: HelpCircle, label: "Help & feedback", hint: "Docs, contact support" },
];

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <ScrollView className="flex-1">
        {/* Avatar + name */}
        <View className="items-center px-6 py-8">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-100">
            <Text className="text-2xl font-bold text-blue-600">
              {user?.firstName?.slice(0, 2)?.toUpperCase() ?? "CC"}
            </Text>
          </View>
          <Text className="mt-3 text-lg font-semibold dark:text-white">
            {user?.fullName ?? "Team member"}
          </Text>
          <Text className="text-sm text-neutral-500">{user?.primaryEmailAddress?.emailAddress}</Text>
          <View className="mt-2 rounded-full bg-blue-100 px-3 py-1">
            <Text className="text-xs font-semibold text-blue-700">Employee</Text>
          </View>
        </View>

        {/* Menu */}
        <View className="mx-4 overflow-hidden rounded-2xl border border-neutral-100 dark:border-neutral-800">
          {MENU_ITEMS.map(({ icon: Icon, label, hint }, i) => (
            <TouchableOpacity
              key={label}
              className={`flex-row items-center gap-3 px-4 py-4 ${i < MENU_ITEMS.length - 1 ? "border-b border-neutral-100 dark:border-neutral-800" : ""}`}
            >
              <View className="rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800">
                <Icon size={16} color="#64748b" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium dark:text-white">{label}</Text>
                <Text className="text-xs text-neutral-400">{hint}</Text>
              </View>
              <ChevronRight size={16} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign out */}
        <TouchableOpacity
          onPress={() => signOut()}
          className="mx-4 mt-4 flex-row items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 py-4"
        >
          <LogOut size={16} color="#ef4444" />
          <Text className="text-sm font-semibold text-red-500">Sign out</Text>
        </TouchableOpacity>

        <Text className="mt-6 mb-8 text-center text-xs text-neutral-400">CrewClock v1.0.0 · Built with ❤️</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
