import Ably from "ably";
import { NextResponse } from "next/server";
import { db, users, tenantMemberships, eq, and } from "@crewclock/db";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await db.query.users.findFirst({ where: eq(users.authUserId, authUser.id) });
  const membership = dbUser
    ? await db.query.tenantMemberships.findFirst({
        where: and(eq(tenantMemberships.userId, dbUser.id), eq(tenantMemberships.isActive, true)),
      })
    : null;
  if (!dbUser || !membership) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = new Ably.Rest(process.env.ABLY_API_KEY!);
  const tokenRequest = await client.auth.createTokenRequest({
    clientId: dbUser.id,
    capability: {
      [`tenant:${membership.tenantId}:*`]: ["subscribe", "publish", "presence"],
      [`tenant:${membership.tenantId}:broadcast`]: ["subscribe"],
    },
    ttl: 3_600_000, // 1 hour
  });
  return NextResponse.json(tokenRequest);
}
