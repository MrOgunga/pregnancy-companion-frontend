import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { transcribe } from "@/lib/voice";

export const maxDuration = 300; // allow for cold start

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof Blob)) return NextResponse.json({ error: "audio file required" }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const name = (file as File).name || "clip.webm";
  try {
    const text = await transcribe(buf, name);
    return NextResponse.json({ ok: true, text });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "asr failed" }, { status: 502 });
  }
}
