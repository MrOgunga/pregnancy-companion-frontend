import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminSession";
import { setPlan, deleteMother } from "@/lib/queries";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const id = String(b.id || "");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  if (b.action === "plan") {
    await setPlan(id, b.plan === "premium" ? "premium" : "free");
    return NextResponse.json({ ok: true });
  }
  if (b.action === "delete") {
    await deleteMother(id);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
