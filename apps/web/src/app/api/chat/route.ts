import { streamText } from "ai";
import { models } from "@crewclock/ai";
import { db, users, tenants, tenantMemberships, eq, and } from "@crewclock/db";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await db.query.users.findFirst({ where: eq(users.authUserId, authUser.id) });
  const membership = dbUser
    ? await db.query.tenantMemberships.findFirst({
        where: and(eq(tenantMemberships.userId, dbUser.id), eq(tenantMemberships.isActive, true)),
      })
    : null;
  if (!dbUser || !membership) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages } = await req.json() as { messages: Array<{ role: string; content: string }> };
  const lastMessage = messages.at(-1);
  if (!lastMessage) return Response.json({ error: "No messages" }, { status: 400 });

  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, membership.tenantId),
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
