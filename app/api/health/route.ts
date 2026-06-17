import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Railway healthcheck.
export function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() });
}
