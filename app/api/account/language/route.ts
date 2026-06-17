import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { updateMotherLanguage } from "@/lib/queries";
import { isLang } from "@/lib/languages";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const lang = String(b.language || "");
  if (!isLang(lang)) return NextResponse.json({ error: "invalid language" }, { status: 400 });
  await updateMotherLanguage(session.sub, lang);
  return NextResponse.json({ ok: true });
}
