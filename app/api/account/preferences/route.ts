import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { updateMotherPreferences } from "@/lib/queries";
import { cleanPrefs } from "@/lib/personalize";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  await updateMotherPreferences(session.sub, cleanPrefs(b));
  return NextResponse.json({ ok: true });
}
