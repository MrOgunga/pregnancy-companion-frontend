import { NextResponse, after } from "next/server";
import { getSession } from "@/lib/session";
import { warm } from "@/lib/voice";

export const maxDuration = 300;

// Wakes the TTS + ASR containers in the background so the first real use is fast.
export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  after(async () => {
    await warm().catch(() => {});
  });
  return NextResponse.json({ ok: true });
}
