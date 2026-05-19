import { Hono } from "hono";
import Stripe from "stripe";
import { env } from "../env";
import { prisma } from "../prisma";
import { auth } from "../auth";

const checkoutRouter = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

function getStripe() {
  return new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2025-04-30.basil" });
}

// GET /api/checkout/status — returns subscription status for current user
checkoutRouter.get("/status", async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: { message: "Unauthorized", code: "unauthorized" } }, 401);

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  const status = dbUser?.subscriptionStatus ?? "none";
  const subscribed = status === "active" || status === "trialing";
  return c.json({ data: { subscribed, status } });
});

// POST /api/checkout/create — creates a Stripe checkout session
checkoutRouter.post("/create", async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: { message: "Unauthorized", code: "unauthorized" } }, 401);

  const body = await c.req.json().catch(() => ({}));
  const successUrl = body.successUrl as string;
  const cancelUrl = body.cancelUrl as string;
  const plan = (body.plan as string) === "annual" ? "annual" : "weekly";

  if (!successUrl || !cancelUrl) {
    return c.json({ error: { message: "successUrl and cancelUrl are required", code: "bad_request" } }, 400);
  }

  const stripe = getStripe();
  const priceId = plan === "annual" ? env.STRIPE_ANNUAL_PRICE_ID : env.STRIPE_PRICE_ID;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    ...(plan === "weekly" ? { subscription_data: { trial_period_days: 3 } } : {}),
    customer_email: user.email,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId: user.id },
  });

  return c.json({ data: { url: session.url, sessionId: session.id } });
});

// POST /api/checkout/verify — verifies a completed checkout session and updates user
checkoutRouter.post("/verify", async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: { message: "Unauthorized", code: "unauthorized" } }, 401);

  const body = await c.req.json().catch(() => ({}));
  const sessionId = body.sessionId as string;
  if (!sessionId) {
    return c.json({ error: { message: "sessionId is required", code: "bad_request" } }, 400);
  }

  const stripe = getStripe();

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (session.payment_status === "paid" || session.status === "complete") {
      const sub = session.subscription as Stripe.Subscription | null;
      const status = sub?.status ?? "active";

      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: status,
          stripeCustomerId: (session.customer as string) ?? undefined,
        },
      });

      return c.json({ data: { success: true, status } });
    }

    // Trial subscriptions: even before payment, mark as trialing
    if (session.status === "complete") {
      await prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: "trialing" },
      });
      return c.json({ data: { success: true, status: "trialing" } });
    }

    return c.json({ data: { success: false, status: "pending" } });
  } catch (err) {
    console.error("Stripe verify error:", err);
    return c.json({ error: { message: "Failed to verify session", code: "stripe_error" } }, 502);
  }
});

export { checkoutRouter };
