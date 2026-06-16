import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getMotherById, saveKickSession } from "@/lib/queries";
import { currentWeekFrom } from "@/lib/babyData";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const mother = await getMotherById(session.sub);
  if (!mother) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  const b = await req.json().catch(() => ({}));
  const week = currentWeekFrom({ dueDate: mother.due_date, enteredWeek: mother.current_week, createdAt: mother.created_at });
  if (!b.started_at || typeof b.kicks !== "number")
    return NextResponse.json({ error: "Invalid session." }, { status: 400 });

  const saved = await saveKickSession(mother.id, {
    started_at: b.started_at,
    completed_at: b.completed_at,
    kicks: b.kicks,
    week,
  });
  return NextResponse.json({ ok: true, session: saved });
}
