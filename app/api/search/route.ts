import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { meiliSearch, meiliConfigured } from "@/lib/meili";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!meiliConfigured()) return NextResponse.json({ ok: true, hits: [] });
  const b = await req.json().catch(() => ({}));
  const hits = await meiliSearch(String(b.q || ""), 8);
  return NextResponse.json({ ok: true, hits });
}
