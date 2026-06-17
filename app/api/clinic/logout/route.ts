import { NextResponse } from "next/server";
import { destroyClinicianSession } from "@/lib/clinicianSession";

export async function POST() {
  await destroyClinicianSession();
  return NextResponse.json({ ok: true });
}
