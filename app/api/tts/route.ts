import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getMotherById } from "@/lib/queries";
import { speak, normalizeVoice } from "@/lib/voice";

export const maxDuration = 300; // allow for cold start

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const b = await req.json().catch(() => ({}));
  const text = String(b.text || "").trim();
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

  let voice = b.voice as string | undefined;
  if (!voice) {
    const m = await getMotherById(session.sub);
    voice = m?.language || "en";
  }

  try {
    const wav = await speak(text, normalizeVoice(voice));
    return new Response(new Uint8Array(wav), { headers: { "Content-Type": "audio/wav", "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "tts failed" }, { status: 502 });
  }
}
