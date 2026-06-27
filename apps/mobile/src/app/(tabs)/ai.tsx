import { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Send, Sparkles } from "lucide-react-native";

interface Message { id: string; role: "user" | "assistant"; content: string; }

const SUGGESTIONS = [
  "Who's available Saturday?",
  "What's our break policy?",
  "Show this week's OT",
  "Help me swap a shift",
];

export default function AIScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.text();
      setMessages(m => [...m, { id: (Date.now()+1).toString(), role: "assistant", content: data.trim() }]);
    } catch {
      setMessages(m => [...m, { id: (Date.now()+1).toString(), role: "assistant", content: "Sorry, I couldn't reach the server. Try again." }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-row items-center gap-3 border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
          <View className="rounded-xl bg-blue-100 p-2">
            <Sparkles size={16} color="#2563eb" />
          </View>
          <View>
            <Text className="text-sm font-semibold dark:text-white">CrewAI</Text>
            <Text className="text-xs text-neutral-400">Llama 3.3 · knows your policies</Text>
          </View>
          <View className="ml-auto flex-row items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1">
            <View className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <Text className="text-xs font-medium text-emerald-700">Online</Text>
          </View>
        </View>

        <ScrollView ref={scrollRef} className="flex-1 px-4 py-4" contentContainerStyle={{ flexGrow: 1 }}>
          {messages.length === 0 ? (
            <View className="flex-1 items-center justify-center gap-4 py-8">
              <Text className="text-base font-semibold text-neutral-700 dark:text-neutral-300">How can I help?</Text>
              <View className="w-full flex-row flex-wrap gap-2 justify-center">
                {SUGGESTIONS.map(s => (
                  <TouchableOpacity key={s} onPress={() => setInput(s)} className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900">
                    <Text className="text-xs font-medium text-neutral-600 dark:text-neutral-400">{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            messages.map(m => (
              <View key={m.id} className={`mb-3 flex-row gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <View className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.role === "user" ? "rounded-tr-sm bg-blue-600" : "rounded-tl-sm bg-neutral-100 dark:bg-neutral-800"}`}>
                  <Text className={`text-sm leading-relaxed ${m.role === "user" ? "text-white" : "text-neutral-800 dark:text-neutral-200"}`}>{m.content}</Text>
                </View>
              </View>
            ))
          )}
          {loading && (
            <View className="mb-3 flex-row justify-start">
              <View className="rounded-2xl rounded-tl-sm bg-neutral-100 px-4 py-3 dark:bg-neutral-800">
                <ActivityIndicator size="small" />
              </View>
            </View>
          )}
        </ScrollView>

        <View className="flex-row items-end gap-2 border-t border-neutral-100 p-3 dark:border-neutral-800">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about schedules, policies…"
            placeholderTextColor="#94a3b8"
            multiline
            className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            style={{ maxHeight: 100 }}
          />
          <TouchableOpacity onPress={send} disabled={!input.trim() || loading} className="rounded-xl bg-blue-600 p-3 disabled:opacity-50">
            <Send size={16} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
