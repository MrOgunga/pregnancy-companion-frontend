import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminSession";
import { runWeeklyJob } from "@/lib/weeklyJob";

export const maxDuration = 300;

export async function POST() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const result = await runWeeklyJob();
  return NextResponse.json(result);
}
