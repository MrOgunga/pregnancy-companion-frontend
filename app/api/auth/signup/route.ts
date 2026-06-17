import { NextResponse } from "next/server";
import { after } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { createMother, getMotherByEmail } from "@/lib/queries";
import { createSession } from "@/lib/session";
import { ensureWeeklyUpdate } from "@/lib/weekly";
import { sendWelcomeEmail } from "@/lib/email";
import { currentWeekFrom, trimesterFor } from "@/lib/babyData";
import { normalizeLang } from "@/lib/languages";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const email = String(b.email || "").trim().toLowerCase();
    const password = String(b.password || "");
    const full_name = String(b.full_name || "").trim();
    const due_date = String(b.due_date || "").trim();
    const enteredWeek = Number.isInteger(Number(b.current_week)) ? Number(b.current_week) : null;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    if (password.length < 8)
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    if (!full_name) return NextResponse.json({ error: "Your name is required." }, { status: 400 });
    if (!due_date && !enteredWeek)
      return NextResponse.json({ error: "Please give your due date or current week." }, { status: 400 });

    // Real, live-computed gestational week (due date wins; otherwise the week she entered).
    const week = currentWeekFrom({ dueDate: due_date || null, enteredWeek });

    if (await getMotherByEmail(email))
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

    const password_hash = await bcrypt.hash(password, 10);
    const mother = await createMother({
      email,
      password_hash,
      full_name,
      partner_name: String(b.partner_name || "").trim() || undefined,
      phone: String(b.phone || "").trim() || undefined,
      whatsapp_number: String(b.whatsapp_number || b.phone || "").trim() || undefined,
      due_date: due_date || undefined,
      current_week: week,
      weeks_completed: week,
      trimester: trimesterFor(week),
      first_pregnancy: String(b.first_pregnancy || "yes").toLowerCase() === "yes",
      dietary_restrictions: String(b.dietary_restrictions || "").trim() || undefined,
      source: String(b.source || "website"),
      language: normalizeLang(b.language),
    });

    await createSession({ sub: mother.id, email: mother.email });
    (await cookies()).set("bumply_lang", normalizeLang(b.language), { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });

    // Respond instantly; generate her first personal notes after the response is sent.
    // The dashboard shows accurate baby facts immediately and polls for these extras.
    after(async () => {
      try {
        await ensureWeeklyUpdate(mother, week);
      } catch (e) {
        console.error("first weekly update generation failed:", e);
      }
      try {
        await sendWelcomeEmail(mother.email, mother.full_name, week);
      } catch (e) {
        console.error("welcome email failed:", e);
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("signup error:", e);
    return NextResponse.json({ error: "Could not create your account right now." }, { status: 500 });
  }
}
