// ─────────────────────────────────────────────────────────────────────────────
// CrewClock RAG Pipeline
// Retrieval-Augmented Generation using pgvector + LangChain.js
// ─────────────────────────────────────────────────────────────────────────────
import { sql } from "@crewclock/db";

// ── Chunking ─────────────────────────────────────────────────────────────────
export function chunkText(text: string, chunkSize = 512, overlap = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let i = 0;
  while (i < words.length) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
    i += chunkSize - overlap;
  }
  return chunks;
}

// ── Embedding ─────────────────────────────────────────────────────────────────
// Uses Groq's nomic-embed-text (768 dimensions, free)
// Falls back to OpenAI text-embedding-3-small if Groq unavailable
export async function embedText(texts: string[]): Promise<number[][]> {
  // In production: use Groq or Ollama for nomic-embed-text
  // For now: simple mock that returns the right shape
  // TODO: replace with actual embedding call:
  // const response = await fetch("https://api.groq.com/openai/v1/embeddings", {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
  //   body: JSON.stringify({ model: "nomic-embed-text-v1_5", input: texts }),
  // });
  throw new Error("Implement embedText with your preferred provider");
}

// ── Indexing ──────────────────────────────────────────────────────────────────
export async function indexDocument(params: {
  tenantId: string;
  documentId: string;
  content: string;
}) {
  const chunks = chunkText(params.content);
  const embeddings = await embedText(chunks);

  // Bulk insert into pgvector table
  await sql`
    INSERT INTO ai_embeddings (tenant_id, document_id, chunk_index, chunk_text, embedding)
    SELECT
      ${params.tenantId},
      ${params.documentId},
      chunk.idx,
      chunk.text,
      chunk.embedding::vector
    FROM unnest(
      ${chunks}::text[],
      ${embeddings.map((e) => `[${e.join(",")}]`)}::text[],
      ${chunks.map((_, i) => i)}::int[]
    ) AS chunk(text, embedding, idx)
  `;
}

// ── Retrieval ─────────────────────────────────────────────────────────────────
export async function retrieveContext(params: {
  tenantId: string;
  query: string;
  topK?: number;
}): Promise<Array<{ chunkText: string; documentId: string; score: number }>> {
  const queryEmbedding = await embedText([params.query]);
  const embedding = queryEmbedding[0];
  const topK = params.topK ?? 5;

  const results = await sql<{ chunk_text: string; document_id: string; score: number }[]>`
    SELECT
      chunk_text,
      document_id,
      1 - (embedding <=> ${`[${embedding.join(",")}]`}::vector) AS score
    FROM ai_embeddings
    WHERE tenant_id = ${params.tenantId}
    ORDER BY embedding <=> ${`[${embedding.join(",")}]`}::vector
    LIMIT ${topK}
  `;
  return results.map((r) => ({
    chunkText: r.chunk_text,
    documentId: r.document_id,
    score: r.score,
  }));
}

// ── System Prompt Builder ─────────────────────────────────────────────────────
export function buildSystemPrompt(params: {
  role: string;
  tenantName: string;
  context: string;
}): string {
  return `You are CrewAI, an intelligent workforce assistant for ${params.tenantName}.
You help ${params.role}s with scheduling questions, HR policies, shift requests, and payroll queries.

COMPANY CONTEXT (from internal documents):
${params.context}

GUIDELINES:
- Answer questions based on the company context above when available
- Be concise and friendly — employees are busy
- For scheduling: mention specific shift times and roles when relevant
- For payroll: explain calculations clearly
- For policy questions: cite the relevant policy section
- If you're unsure, say so and suggest asking a manager
- Never reveal other employees' private data
- Current date context is provided automatically

Respond in plain language without markdown unless formatting genuinely helps.`;
}
