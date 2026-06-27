// Stripe webhook — placeholder until Stripe is configured
// Add STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET env vars to enable

export async function POST() {
  return new Response("Stripe not configured", { status: 200 });
}
