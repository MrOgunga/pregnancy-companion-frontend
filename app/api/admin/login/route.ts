import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/adminSession";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({}));
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }
  await createAdminSession();
  return NextResponse.json({ ok: true });
}
