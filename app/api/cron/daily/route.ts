import { NextResponse } from "next/server";
import { runDailyEngagement } from "@/lib/notify";

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const url = new URL(req.url);
  return req.headers.get("authorization") === `Bearer ${secret}` || url.searchParams.get("secret") === secret;
}

function today(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

async function handle(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const result = await runDailyEngagement(today());
  return NextResponse.json({ ok: true, date: today(), ...result });
}

export const GET = handle;
export const POST = handle;

export const maxDuration = 300;
