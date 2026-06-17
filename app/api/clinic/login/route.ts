import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getClinicianByEmail } from "@/lib/queries";
import { createClinicianSession } from "@/lib/clinicianSession";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  const c = await getClinicianByEmail(email);
  if (!c || !(await bcrypt.compare(password, c.password_hash)))
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  await createClinicianSession({ sub: c.id, email: c.email, name: c.name });
  return NextResponse.json({ ok: true });
}
