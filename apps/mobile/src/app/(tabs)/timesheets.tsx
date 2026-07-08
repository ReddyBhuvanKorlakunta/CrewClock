import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";
import { Clock, CheckCircle } from "lucide-react-native";
import { trpc } from "@/lib/trpc";

function formatHours(minutes: number) {
  return `${(minutes / 60).toFixed(1)}h`;
}
function formatDollars(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export default function TimesheetsScreen() {
  const { data: summary, isLoading } = trpc.payroll.getMyCurrentSummary.useQuery();
  const hasData = !!summary && (summary.regularMinutes > 0 || summary.otMinutes > 0);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="px-4 pb-3 pt-2">
        <Text className="text-xl font-bold text-neutral-900 dark:text-white">Timesheets</Text>
        <Text className="mt-0.5 text-sm text-neutral-500">Your hours & pay this week</Text>
      </View>
      <ScrollView className="flex-1">
        {isLoading ? (
          <View className="items-center py-16">
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <View className="mx-4 mb-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <Text className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Current period</Text>
              {[
                { label: "Regular hours", value: formatHours(summary?.regularMinutes ?? 0), icon: Clock },
                { label: "Overtime", value: formatHours(summary?.otMinutes ?? 0), icon: Clock },
                { label: "Est. gross pay", value: formatDollars(summary?.grossPay ?? 0), icon: CheckCircle },
              ].map(({ label, value, icon: Icon }) => (
                <View key={label} className="mb-2 flex-row items-center justify-between">
                  <Text className="text-sm text-neutral-500">{label}</Text>
                  <Text className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{value}</Text>
                </View>
              ))}
            </View>
            {!hasData && (
              <View className="flex-1 items-center py-16">
                <Clock size={40} color="#94a3b8" />
                <Text className="mt-3 text-sm font-medium text-neutral-500">No clock events this period</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
