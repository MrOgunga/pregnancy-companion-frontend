import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminSession";
import {
  createInstance,
  setWebhook,
  connectInstance,
  connectionState,
  getInstanceInfo,
  logoutInstance,
  sendText,
  applyAntiBanSettings,
  webhookUrl,
  evolutionConfigured,
} from "@/lib/evolution";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!evolutionConfigured())
    return NextResponse.json(
      { error: "Evolution API not configured. Set EVOLUTION_API_URL and EVOLUTION_API_KEY in your env." },
      { status: 400 }
    );

  const b = await req.json().catch(() => ({}));
  const action = String(b.action || "");

  switch (action) {
    case "create": {
      const create = await createInstance();
      const webhook = create.ok ? await setWebhook() : { ok: false, error: "instance not created" };
      const antiban = create.ok ? await applyAntiBanSettings() : { ok: false };
      return NextResponse.json({ ok: create.ok, create, webhook, antiban, webhookUrl: webhookUrl() });
    }
    case "antiban": {
      return NextResponse.json(await applyAntiBanSettings());
    }
    case "connect": {
      return NextResponse.json(await connectInstance());
    }
    case "status": {
      const state = await connectionState();
      const info = await getInstanceInfo();
      return NextResponse.json({ ok: state.ok, state: state.data, info: info.data });
    }
    case "webhook": {
      const w = await setWebhook();
      return NextResponse.json({ ...w, webhookUrl: webhookUrl() });
    }
    case "logout": {
      return NextResponse.json(await logoutInstance());
    }
    case "test": {
      return NextResponse.json(await sendText(String(b.to || ""), "Hi! This is a test message from Bumply 🌸"));
    }
    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }
}
