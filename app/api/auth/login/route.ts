import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getMotherByEmail } from "@/lib/queries";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const email = String(b.email || "").trim().toLowerCase();
    const password = String(b.password || "");

    const mother = await getMotherByEmail(email);
    if (!mother || !(await bcrypt.compare(password, mother.password_hash)))
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });

    await createSession({ sub: mother.id, email: mother.email });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("login error:", e);
    return NextResponse.json({ error: "Could not sign you in right now." }, { status: 500 });
  }
}
