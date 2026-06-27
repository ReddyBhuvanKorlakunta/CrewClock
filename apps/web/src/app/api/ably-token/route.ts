import Ably from "ably";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = new Ably.Rest(process.env.ABLY_API_KEY!);
  const tokenRequest = await client.auth.createTokenRequest({
    clientId: userId,
    capability: {
      [`tenant:${orgId}:*`]: ["subscribe", "publish", "presence"],
      [`tenant:${orgId}:broadcast`]: ["subscribe"],
    },
    ttl: 3_600_000, // 1 hour
  });
  return NextResponse.json(tokenRequest);
}
