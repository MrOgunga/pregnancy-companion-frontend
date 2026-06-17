import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { deletePushSubscription } from "@/lib/queries";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (b?.endpoint) await deletePushSubscription(String(b.endpoint));
  return NextResponse.json({ ok: true });
}
