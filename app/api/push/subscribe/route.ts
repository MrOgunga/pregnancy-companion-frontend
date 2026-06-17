import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { savePushSubscription } from "@/lib/queries";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const endpoint: string = b?.endpoint;
  const keys = b?.keys || {};
  if (!endpoint || !keys.p256dh || !keys.auth) return NextResponse.json({ error: "invalid subscription" }, { status: 400 });
  await savePushSubscription(session.sub, { endpoint, p256dh: keys.p256dh, auth: keys.auth });
  return NextResponse.json({ ok: true });
}
