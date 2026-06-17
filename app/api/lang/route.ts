import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { updateMotherLanguage } from "@/lib/queries";
import { isLang } from "@/lib/languages";
import { LANG_COOKIE } from "@/lib/serverLang";

// Sets the UI-language cookie (everyone) and persists to the mom's profile if logged in.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const lang = String(b.language || "");
  if (!isLang(lang)) return NextResponse.json({ error: "invalid language" }, { status: 400 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(LANG_COOKIE, lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });

  const session = await getSession().catch(() => null);
  if (session) await updateMotherLanguage(session.sub, lang).catch(() => {});
  return res;
}
