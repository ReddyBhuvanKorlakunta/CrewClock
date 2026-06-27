import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, managerProcedure } from "../trpc";
import { aiConversations, aiMessages, aiDocuments, eq, and, desc } from "@crewclock/db";

export const aiRouter = router({
  // Start or continue a conversation
  chat: protectedProcedure
    .input(z.object({
      conversationId: z.string().uuid().optional(),
      message: z.string().min(1).max(2000),
    }))
    .mutation(async ({ ctx, input }) => {
      // Create conversation if new
      let convId = input.conversationId;
      if (!convId) {
        const [conv] = await ctx.db.insert(aiConversations).values({
          tenantId: ctx.tenantId,
          userId: ctx.user.id,
          title: input.message.slice(0, 60),
        }).returning();
        if (!conv) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create conversation" });
        convId = conv.id;
      }

      // Save user message
      await ctx.db.insert(aiMessages).values({
        conversationId: convId,
        role: "user",
        content: input.message,
      });

      // NOTE: actual RAG + LLM call happens in the web app's streaming route
      // This procedure returns the conversation ID for the client to connect to
      return { conversationId: convId };
    }),

  getConversationHistory: protectedProcedure
    .input(z.object({ conversationId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select()
        .from(aiMessages)
        .where(eq(aiMessages.conversationId, input.conversationId))
        .orderBy(aiMessages.createdAt);
    }),

  // Index a document for RAG
  indexDocument: managerProcedure
    .input(z.object({
      title: z.string(),
      content: z.string().min(10),
      sourceType: z.enum(["handbook", "policy", "faq", "schedule_history", "payroll_record", "custom"]),
      fileUrl: z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [doc] = await ctx.db.insert(aiDocuments).values({
        tenantId: ctx.tenantId,
        title: input.title,
        content: input.content,
        sourceType: input.sourceType,
        fileUrl: input.fileUrl,
      }).returning();
      // Trigger async indexing job via QStash
      // await qstash.publishJSON({ url: `${env.APP_URL}/api/jobs/index-document`, body: { documentId: doc.id } });
      return doc;
    }),
});
