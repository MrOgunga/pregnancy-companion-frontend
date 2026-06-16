import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { setPlan } from "@/lib/queries";

// DEMO STUB: flips the account to premium with no payment.
// Later, swap this for a Paystack/Stripe checkout + webhook that calls setPlan on success.
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const plan = body.plan === "free" ? "free" : "premium";
  await setPlan(session.sub, plan);
  return NextResponse.json({ ok: true, plan });
}
