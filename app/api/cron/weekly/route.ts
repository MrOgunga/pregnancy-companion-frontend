import { NextResponse } from "next/server";
import { runWeeklyJob } from "@/lib/weeklyJob";

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const url = new URL(req.url);
  return req.headers.get("authorization") === `Bearer ${secret}` || url.searchParams.get("secret") === secret;
}

async function handle(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const result = await runWeeklyJob();
  return NextResponse.json(result);
}

// Support both so it works with any scheduler (cron services often use GET).
export const GET = handle;
export const POST = handle;

export const maxDuration = 300;
