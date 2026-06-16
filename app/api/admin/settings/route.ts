import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminSession";
import { setSetting } from "@/lib/settings";

const ALLOWED = ["premium_price", "ai_model", "weekly_send_day", "journal_enabled", "tools_enabled", "chat_enabled"];

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  for (const key of ALLOWED) {
    if (key in b) await setSetting(key, String(b[key]));
  }
  return NextResponse.json({ ok: true });
}
