import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { isAdmin } from "@/lib/adminSession";
import { createClinician } from "@/lib/queries";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase();
  const name = String(b.name || "").trim();
  const password = String(b.password || "");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  if (!name) return NextResponse.json({ error: "Name required." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  const hash = await bcrypt.hash(password, 10);
  const c = await createClinician(email, hash, name);
  return NextResponse.json({ ok: true, clinician: { id: c.id, email: c.email, name: c.name } });
}
