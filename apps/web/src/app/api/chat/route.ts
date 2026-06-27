import { streamText } from "ai";
import { auth } from "@clerk/nextjs/server";
import { models } from "@crewclock/ai";
import { db, tenants, eq } from "@crewclock/db";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages } = await req.json() as { messages: Array<{ role: string; content: string }> };
  const lastMessage = messages.at(-1);
  if (!lastMessage) return Response.json({ error: "No messages" }, { status: 400 });

  // Fetch tenant by Clerk org ID (not UUID)
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.clerkOrgId, orgId),
  });

  const tenantName = tenant?.name ?? "your organization";

  const systemPrompt = `You are CrewAI, an AI assistant for ${tenantName}.
You help managers and employees with scheduling, payroll questions, HR policies, and workforce management.
Be concise, helpful, and professional. If you don't know something specific to their business, say so.
Today is ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`;

  const result = streamText({
    model: models.fast,
    system: systemPrompt,
    messages: messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
    temperature: 0.3,
    maxTokens: 800,
  });

  return result.toDataStreamResponse();
}
