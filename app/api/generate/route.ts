import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getMotherById, getWeeklyUpdateByWeek } from "@/lib/queries";
import { ensureWeeklyUpdate } from "@/lib/weekly";
import { currentWeekFrom } from "@/lib/babyData";

function weekFor(m: { due_date: string | null; current_week: number; created_at: string }) {
  return currentWeekFrom({ dueDate: m.due_date, enteredWeek: m.current_week, createdAt: m.created_at });
}

// Status check used by the dashboard poller — does NOT generate.
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const mother = await getMotherById(session.sub);
  if (!mother) return NextResponse.json({ error: "Account not found." }, { status: 404 });
  const week = weekFor(mother);
  const existing = await getWeeklyUpdateByWeek(mother.id, week);
  return NextResponse.json({ ready: !!existing, week });
}

// Generates the weekly update for the mother's current week if missing.
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const mother = await getMotherById(session.sub);
  if (!mother) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const week = Number.isInteger(body.week) ? body.week : weekFor(mother);

  try {
    const update = await ensureWeeklyUpdate(mother, week);
    return NextResponse.json({ ok: true, week: update.week_number });
  } catch (e) {
    console.error("generate error:", e);
    return NextResponse.json({ error: "Generation failed. Please try again." }, { status: 500 });
  }
}
