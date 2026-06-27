import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format, startOfWeek, addDays, addWeeks, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

const DAYS = ["M","T","W","T","F","S","S"];

export default function ScheduleScreen() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  // TODO: wire up tRPC trpc.scheduling.getWeek query
  const shifts: never[] = [];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="px-4 pb-3 pt-2">
        <Text className="text-xl font-bold text-neutral-900 dark:text-white">Schedule</Text>
      </View>

      {/* Week nav */}
      <View className="flex-row items-center justify-between border-b border-neutral-100 px-4 pb-3 dark:border-neutral-800">
        <TouchableOpacity onPress={() => setWeekStart(w => subWeeks(w, 1))} className="p-2">
          <ChevronLeft size={18} color="#64748b" />
        </TouchableOpacity>
        <Text className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          {format(weekStart, "MMM d")} – {format(addDays(weekStart, 6), "MMM d, yyyy")}
        </Text>
        <TouchableOpacity onPress={() => setWeekStart(w => addWeeks(w, 1))} className="p-2">
          <ChevronRight size={18} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Day strip */}
      <View className="flex-row border-b border-neutral-100 px-2 py-2 dark:border-neutral-800">
        {DAYS.map((d, i) => {
          const date = addDays(weekStart, i);
          const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
          return (
            <View key={i} className="flex-1 items-center gap-1">
              <Text className="text-xs font-medium text-neutral-400">{d}</Text>
              <View className={`h-8 w-8 items-center justify-center rounded-full ${isToday ? "bg-blue-600" : ""}`}>
                <Text className={`text-sm font-semibold ${isToday ? "text-white" : "text-neutral-700 dark:text-neutral-300"}`}>
                  {format(date, "d")}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {shifts.length === 0 ? (
          <View className="items-center py-20">
            <Text className="text-base font-medium text-neutral-500">No shifts this week</Text>
            <Text className="mt-1 text-sm text-neutral-400">Shifts published by your manager will appear here</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
