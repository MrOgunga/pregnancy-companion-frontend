import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminSession";
import { sendPushToAll, pushConfigured } from "@/lib/push";
import { runDailyEngagement } from "@/lib/notify";
import { runWeeklyJob } from "@/lib/weeklyJob";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const action = String(b.action || "");

  switch (action) {
    case "broadcast": {
      if (!pushConfigured()) return NextResponse.json({ error: "Push not configured (set VAPID keys)." }, { status: 400 });
      const title = String(b.title || "Bumply 🌸").slice(0, 80);
      const body = String(b.body || "").slice(0, 300);
      if (!body) return NextResponse.json({ error: "Message body required." }, { status: 400 });
      const delivered = await sendPushToAll({ title, body, url: String(b.url || "/dashboard"), tag: "broadcast" });
      return NextResponse.json({ ok: true, delivered });
    }
    case "daily": {
      const result = await runDailyEngagement(today());
      return NextResponse.json({ ok: true, ...result });
    }
    case "weekly": {
      const result = await runWeeklyJob();
      return NextResponse.json(result);
    }
    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }
}
