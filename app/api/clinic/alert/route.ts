import { NextResponse } from "next/server";
import { getClinician } from "@/lib/clinicianSession";
import { setAlertStatus } from "@/lib/queries";

export async function POST(req: Request) {
  const clin = await getClinician();
  if (!clin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const id = String(b.id || "");
  const status = String(b.status || "");
  if (!id || !["open", "reviewed", "resolved"].includes(status))
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  await setAlertStatus(id, status, clin.name);
  return NextResponse.json({ ok: true });
}
