import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getMotherById, createJournalEntry } from "@/lib/queries";
import { currentWeekFrom } from "@/lib/babyData";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const mother = await getMotherById(session.sub);
  if (!mother) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  const b = await req.json().catch(() => ({}));
  const week = currentWeekFrom({ dueDate: mother.due_date, enteredWeek: mother.current_week, createdAt: mother.created_at });
  const symptoms = Array.isArray(b.symptoms) ? b.symptoms.map(String).slice(0, 20) : [];

  const entry = await createJournalEntry(mother.id, {
    mood: typeof b.mood === "string" ? b.mood : undefined,
    symptoms,
    note: typeof b.note === "string" ? b.note.slice(0, 1000) : undefined,
    week,
  });
  return NextResponse.json({ ok: true, entry });
}
