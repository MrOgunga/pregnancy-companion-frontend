import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getMotherByEmail } from "@/lib/queries";
import { createSession } from "@/lib/session";
import { LANG_COOKIE } from "@/lib/serverLang";
import { normalizeLang } from "@/lib/languages";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const email = String(b.email || "").trim().toLowerCase();
    const password = String(b.password || "");

    const mother = await getMotherByEmail(email);
    if (!mother || !(await bcrypt.compare(password, mother.password_hash)))
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });

    await createSession({ sub: mother.id, email: mother.email });
    // Sync UI language to her saved preference.
    (await cookies()).set(LANG_COOKIE, normalizeLang(mother.language), { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("login error:", e);
    return NextResponse.json({ error: "Could not sign you in right now." }, { status: 500 });
  }
}
