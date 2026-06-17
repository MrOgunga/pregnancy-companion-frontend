"use client";
import { useState } from "react";

async function call(action: string, extra?: Record<string, unknown>) {
  const res = await fetch("/api/admin/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...extra }),
  });
  return res.json().catch(() => ({}));
}

export default function AdminNotify() {
  const [title, setTitle] = useState("Bumply 🌸");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  async function broadcast() {
    if (!body.trim()) return;
    setBusy("broadcast");
    setMsg("");
    const r = await call("broadcast", { title, body });
    setMsg(r.ok ? `✓ Sent to ${r.delivered} device(s).` : `Failed: ${r.error || "error"}`);
    setBusy(null);
  }
  async function run(action: "daily" | "weekly") {
    setBusy(action);
    setMsg("");
    const r = await call(action);
    if (action === "daily") setMsg(r.ok ? `✓ Daily run: ${r.anc} ANC, ${r.milestone} milestones, ${r.daily} tips across ${r.mothers} moms.` : `Failed: ${r.error || "error"}`);
    else setMsg(r.ok ? `✓ Weekly run: ${r.generated} generated, ${r.emailed} emailed, ${r.whatsapped} WhatsApp.` : `Failed: ${r.error || "error"}`);
    setBusy(null);
  }

  return (
    <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="card">
        <p className="s-label">Broadcast push</p>
        <p className="muted" style={{ marginBottom: 12 }}>Send a notification to every mom who has enabled notifications.</p>
        <div className="fg">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
        </div>
        <div className="fg">
          <label>Message</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={300} rows={3} placeholder="e.g. New meal plans just dropped 🌸" style={{ width: "100%" }} />
        </div>
        <button className="btn-pink" onClick={broadcast} disabled={busy !== null || !body.trim()}>
          {busy === "broadcast" ? "Sending…" : "Send broadcast"}
        </button>
      </div>

      <div className="card">
        <p className="s-label">Run jobs now</p>
        <p className="muted" style={{ marginBottom: 12 }}>Manually trigger the scheduled jobs (normally run by cron).</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn-ghost" onClick={() => run("daily")} disabled={busy !== null}>
            {busy === "daily" ? "Running…" : "Run daily (tips, reminders, milestones)"}
          </button>
          <button className="btn-ghost" onClick={() => run("weekly")} disabled={busy !== null}>
            {busy === "weekly" ? "Running…" : "Run weekly (generate + deliver)"}
          </button>
        </div>
      </div>

      {msg && <p className="muted">{msg}</p>}
    </div>
  );
}
