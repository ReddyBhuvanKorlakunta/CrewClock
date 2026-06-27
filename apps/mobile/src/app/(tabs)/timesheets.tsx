import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";
import { Clock, CheckCircle } from "lucide-react-native";

export default function TimesheetsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="px-4 pb-3 pt-2">
        <Text className="text-xl font-bold text-neutral-900 dark:text-white">Timesheets</Text>
        <Text className="mt-0.5 text-sm text-neutral-500">Your approved hours & pay</Text>
      </View>
      <ScrollView className="flex-1">
        <View className="mx-4 mb-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <Text className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Current period</Text>
          {[
            { label: "Regular hours", value: "0h", icon: Clock },
            { label: "Overtime", value: "0h", icon: Clock },
            { label: "Est. gross pay", value: "$0.00", icon: CheckCircle },
          ].map(({ label, value, icon: Icon }) => (
            <View key={label} className="mb-2 flex-row items-center justify-between">
              <Text className="text-sm text-neutral-500">{label}</Text>
              <Text className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{value}</Text>
            </View>
          ))}
        </View>
        <View className="flex-1 items-center py-16">
          <Clock size={40} color="#94a3b8" />
          <Text className="mt-3 text-sm font-medium text-neutral-500">No clock events this period</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
