import Stripe from "stripe";
import { db, tenants } from "@crewclock/db";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-11-20.acacia" });

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();
  const sig = headerPayload.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    const plan = sub.items.data[0]?.price.lookup_key?.split("_")[0] ?? "starter";
    await db.update(tenants).set({ stripeSubscriptionId: sub.id, plan: plan as "starter" }).where(eq(tenants.stripeCustomerId, customerId));
  }

  return new Response("OK", { status: 200 });
}
