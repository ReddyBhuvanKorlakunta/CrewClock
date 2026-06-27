import { Webhook } from "svix";
import { headers } from "next/headers";
import { db, users, tenantMemberships, tenants } from "@crewclock/db";
import { eq } from "drizzle-orm";
import type { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) return new Response("Missing secret", { status: 500 });

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
  if (!svix_id || !svix_timestamp || !svix_signature)
    return new Response("Missing svix headers", { status: 400 });

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  // Sync user create/update
  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url, username } = evt.data;
    const email = email_addresses[0]?.email_address ?? "";
    await db
      .insert(users)
      .values({
        clerkId: id,
        email,
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        imageUrl: image_url ?? null,
        username: username ?? null,
      })
      .onConflictDoUpdate({
        target: users.clerkId,
        set: {
          email,
          firstName: first_name ?? "",
          lastName: last_name ?? "",
          imageUrl: image_url ?? null,
          username: username ?? null,
          updatedAt: new Date(),
        },
      });
  }

  // Sync organization create
  if (evt.type === "organization.created") {
    const { id, name, slug } = evt.data;
    await db
      .insert(tenants)
      .values({ clerkOrgId: id, name, slug: slug ?? id, plan: "free" })
      .onConflictDoNothing();
  }

  // Sync organization membership
  if (evt.type === "organizationMembership.created") {
    const { organization, public_user_data, role } = evt.data;
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, public_user_data.user_id),
    });
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.clerkOrgId, organization.id),
    });
    if (user && tenant) {
      const mappedRole = role === "org:admin" ? "admin" : "employee";
      await db
        .insert(tenantMemberships)
        .values({ tenantId: tenant.id, userId: user.id, role: mappedRole })
        .onConflictDoNothing();
    }
  }

  return new Response("OK", { status: 200 });
}
