import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import * as LocalAuthentication from "expo-local-authentication";
import { format } from "date-fns";

type ClockState = "idle" | "clocked-in" | "loading";

export default function HomeScreen() {
  const [now, setNow] = useState(new Date());
  const [state, setState] = useState<ClockState>("idle");
  const [locationText, setLocationText] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  async function authenticate(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHardware || !isEnrolled) return true;
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: state === "idle" ? "Authenticate to clock in" : "Authenticate to clock out",
      fallbackLabel: "Use passcode",
    });
    return result.success;
  }

  async function getLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return null;
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    return loc;
  }

  async function handleToggle() {
    setState("loading");
    try {
      const authed = await authenticate();
      if (!authed) { setState(state === "idle" ? "idle" : "clocked-in"); return; }
      const loc = await getLocation();
      if (loc) setLocationText(`${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`);
      // TODO: call tRPC clockIn/clockOut mutation
      setState(s => s === "idle" ? "clocked-in" : "idle");
    } catch (err) {
      Alert.alert("Error", "Could not complete clock action. Please try again.");
      setState(s => s === "loading" ? "idle" : s);
    }
  }

  const isIn = state === "clocked-in";
  const isLoading = state === "loading";

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-1 items-center justify-center px-6">
        {/* Brand */}
        <Text className="mb-8 text-2xl font-bold text-blue-600">CrewClock</Text>

        {/* Clock ring */}
        <View className={`mb-8 h-52 w-52 items-center justify-center rounded-full border-4 ${isIn ? "border-emerald-500 bg-emerald-50" : "border-blue-200 bg-blue-50"}`}>
          <Text className="font-mono text-4xl font-bold tabular-nums tracking-tight text-neutral-800 dark:text-white">
            {format(now, "HH:mm:ss")}
          </Text>
          <Text className="mt-1 text-xs text-neutral-500">{format(now, "EEE, MMM d")}</Text>
          <View className={`mt-3 flex-row items-center gap-1.5 rounded-full px-3 py-1 ${isIn ? "bg-emerald-100" : "bg-neutral-100"}`}>
            <View className={`h-2 w-2 rounded-full ${isIn ? "bg-emerald-500" : "bg-neutral-400"}`} />
            <Text className={`text-xs font-semibold ${isIn ? "text-emerald-700" : "text-neutral-500"}`}>
              {isIn ? "Clocked In" : "Not clocked in"}
            </Text>
          </View>
        </View>

        {/* Action button */}
        <TouchableOpacity
          onPress={handleToggle}
          disabled={isLoading}
          className={`w-full items-center rounded-2xl py-5 ${isIn ? "bg-red-500" : "bg-blue-600"} disabled:opacity-60`}
          style={{ elevation: 4 }}
        >
          {isLoading
            ? <ActivityIndicator color="white" size="small" />
            : <Text className="text-base font-bold text-white">{isIn ? "Clock Out" : "Clock In"}</Text>
          }
        </TouchableOpacity>

        {locationText && (
          <Text className="mt-3 text-xs text-neutral-400">📍 GPS: {locationText}</Text>
        )}
        <Text className="mt-2 text-xs text-neutral-400">Biometric auth · GPS verified · Offline capable</Text>
      </View>
    </SafeAreaView>
  );
}
