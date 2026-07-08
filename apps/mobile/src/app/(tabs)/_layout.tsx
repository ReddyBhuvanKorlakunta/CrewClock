import { Tabs, Redirect } from "expo-router";
import { Clock, Calendar, FileText, MessageSquare, User } from "lucide-react-native";
import { useAccountState } from "@/lib/use-account-state";

export default function TabsLayout() {
  const { loading, session, accountStatus, onboardingCompleted } = useAccountState();
  if (loading) return null;
  if (!session) return <Redirect href="/(auth)/sign-in" />;
  if (accountStatus === "soft_deleted") return <Redirect href="/(auth)/restore-account" />;
  if (accountStatus !== "active" || !onboardingCompleted) return <Redirect href="/(auth)/pending-setup" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: { borderTopWidth: 1, borderTopColor: "#f1f5f9", backgroundColor: "#ffffff", paddingBottom: 4 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Clock", tabBarIcon: ({ color, size }) => <Clock size={size} color={color} /> }} />
      <Tabs.Screen name="schedule" options={{ title: "Schedule", tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} /> }} />
      <Tabs.Screen name="timesheets" options={{ title: "Timesheets", tabBarIcon: ({ color, size }) => <FileText size={size} color={color} /> }} />
      <Tabs.Screen name="ai" options={{ title: "CrewAI", tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color, size }) => <User size={size} color={color} /> }} />
    </Tabs>
  );
}
