// ─────────────────────────────────────────────────────────────────────────────
// CrewClock Model Router
// Routes requests to cheapest/fastest model for the task
// ─────────────────────────────────────────────────────────────────────────────
import { createGroq } from "@ai-sdk/groq";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const groq = createGroq({ apiKey: process.env.GROQ_API_KEY! });
export const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
export const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });

/**
 * Model routing strategy:
 *
 * FAST   — Groq Llama 3.3 70B        → chat, shift suggestions, quick Q&A
 *          Free tier: 14,400 req/day, 750 tok/s
 *
 * SMART  — Claude claude-haiku-4-5           → payroll Q&A, multi-step reasoning
 *          Paid: ~$0.25/MTok in
 *
 * FLASH  — Gemini 2.0 Flash          → fallback when Groq rate-limited
 *          Free: 1,500 req/day
 */
export const models = {
  // Default: Groq Llama 3.3 70B (free, fast)
  fast: groq("llama-3.3-70b-versatile"),

  // Complex reasoning (paid)
  smart: anthropic("claude-haiku-4-5"),

  // Fallback
  flash: google("gemini-2.0-flash-exp"),

  // Embeddings — nomic-embed-text via Groq
  // NOTE: Groq doesn't have embeddings API yet; use direct Ollama or OpenAI fallback
  // In production use: openai("text-embedding-3-small") for reliability
} as const;

export type ModelKey = keyof typeof models;

/**
 * Pick the right model based on task type
 */
export function selectModel(task: "chat" | "schedule" | "payroll" | "compliance" | "embed") {
  switch (task) {
    case "payroll":
    case "compliance":
      return models.smart;
    case "chat":
    case "schedule":
    default:
      return models.fast;
  }
}
