// Tests the WhatsApp two-way chat brain: companion reply (grounded + in-language)
// and the inbound webhook path (match mother -> reply -> save). Does NOT require the
// Evolution instance to be connected (outbound send just fails gracefully).
import { readFileSync } from "node:fs";
import bcrypt from "bcryptjs";
const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const q = await import("../lib/queries.ts");
const { bumplyReply } = await import("../lib/companion.ts");
const { whatsappConfigured } = await import("../lib/whatsapp.ts");
const { connectionState } = await import("../lib/evolution.ts");

const BASE = "http://localhost:8080";
const SECRET = process.env.WHATSAPP_WEBHOOK_SECRET || process.env.CRON_SECRET || "";
let pass = 0, fail = 0;
const ok = (n: string, c: boolean, d = "") => { if (c) { pass++; console.log("  ✓ " + n); } else { fail++; console.log("  ✗ " + n + (d ? ` — ${d}` : "")); } };

console.log("— Channel status —");
ok("WhatsApp/Evolution configured", whatsappConfigured());
const st = await connectionState();
const state = (st.data as { instance?: { state?: string } })?.instance?.state;
console.log(`  · instance state: ${state}${state !== "open" ? "  (outbound paused until QR re-scan)" : ""}`);

// Throwaway registered mother (Pidgin), phone is the inbound sender.
const phone = "2348100000000";
const email = `wa+${Date.now()}@test.bumply`;
const mother = await q.createMother({
  email, password_hash: await bcrypt.hash("x", 4), full_name: "WA Tester",
  phone: "+234 810 000 0000", whatsapp_number: phone, current_week: 8, weeks_completed: 8,
  trimester: "first", first_pregnancy: true, language: "pcm",
});
await q.setPlan(mother.id, "premium");

console.log("\n— Companion reply (Pidgin, RAG-grounded, concise) —");
const reply = await bumplyReply(mother, "I dey vomit every morning, wetin fit help?");
console.log("  reply:", JSON.stringify(reply));
ok("reply is non-empty + concise", reply.length > 5 && reply.length < 600, `len ${reply.length}`);

console.log("\n— Inbound webhook path (match mother → reply → save) —");
const before = (await q.recentChat(mother.id, 50)).length;
const res = await fetch(`${BASE}/api/whatsapp/webhook?secret=${SECRET}`, {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ event: "messages.upsert", instance: "bumply", data: { key: { remoteJid: `${phone}@s.whatsapp.net`, fromMe: false, id: "T1" }, pushName: "WA", message: { conversation: "How my baby dey this week?" } } }),
});
ok("webhook accepts valid event (200)", res.status === 200, `status ${res.status}`);
// handler runs in after(): wait for AI reply + DB save.
await new Promise((r) => setTimeout(r, 8000));
const after = await q.recentChat(mother.id, 50);
ok("inbound message matched mother + reply saved", after.length >= before + 2, `chat grew ${before}→${after.length}`);
const lastAssistant = [...after].reverse().find((m) => m.role === "assistant");
ok("saved assistant reply is non-empty", !!lastAssistant?.content?.trim());

console.log("\n— Webhook security —");
const bad = await fetch(`${BASE}/api/whatsapp/webhook?secret=wrong`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "messages.upsert", data: {} }) });
ok("wrong secret rejected (401)", bad.status === 401);

await q.deleteMother(mother.id);
ok("cleanup", !(await q.getMotherByEmail(email)));

console.log(`\n=========== ${pass} passed · ${fail} failed ===========`);
process.exit(fail ? 1 : 0);
