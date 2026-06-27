import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
// NOTE: vector type requires pgvector extension. Add to migration:
// CREATE EXTENSION IF NOT EXISTS vector;
import { customType } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { users } from "./users";

// Custom vector type for pgvector
const vector = (name: string, dimensions: number) =>
  customType<{ data: number[]; driverData: string }>({
    dataType() { return `vector(${dimensions})`; },
    toDriver(value) { return `[${value.join(",")}]`; },
    fromDriver(value) {
      return value.slice(1, -1).split(",").map(Number);
    },
  })(name);

export const aiDocuments = pgTable("ai_documents", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  sourceType: text("source_type", {
    enum: ["handbook", "policy", "faq", "schedule_history", "payroll_record", "custom"],
  }).notNull(),
  content: text("content").notNull(),
  fileUrl: text("file_url"),
  metadata: text("metadata"), // JSON string
  indexedAt: timestamp("indexed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aiEmbeddings = pgTable("ai_embeddings", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  documentId: uuid("document_id").references(() => aiDocuments.id, { onDelete: "cascade" }).notNull(),
  chunkIndex: integer("chunk_index").notNull(),
  chunkText: text("chunk_text").notNull(),
  embedding: vector("embedding", 768), // nomic-embed-text dimensions
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Index: CREATE INDEX ON ai_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists=100);
}, (t) => ({
  tenantDocIdx: index("embeddings_tenant_doc_idx").on(t.tenantId, t.documentId),
}));

export const aiConversations = pgTable("ai_conversations", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aiMessages = pgTable("ai_messages", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  conversationId: uuid("conversation_id").references(() => aiConversations.id, { onDelete: "cascade" }).notNull(),
  role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
  content: text("content").notNull(),
  sourcesJson: text("sources_json"), // JSON array of retrieved chunk IDs
  modelUsed: text("model_used"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
