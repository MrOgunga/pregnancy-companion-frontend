"use client";
import { useState } from "react";

export default function RunWeeklyButton() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string>("");

  async function run() {
    setBusy(true);
    setResult("");
    try {
      const res = await fetch("/api/admin/run-weekly", { method: "POST" });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "failed");
      setResult(
        `Done — ${d.generated} update(s) ready · ${d.emailed} emailed · ${d.whatsapped} WhatsApp · ${d.errors} error(s). ` +
          `Channels: email ${d.channels.email ? "on" : "off"}, WhatsApp ${d.channels.whatsapp ? "on" : "off"}.`
      );
    } catch (e) {
      setResult(e instanceof Error ? e.message : "failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button className="f-submit" style={{ maxWidth: 260 }} onClick={run} disabled={busy}>
        {busy ? "Running weekly job…" : "Run weekly job now ▶"}
      </button>
      {result && <p className="muted" style={{ marginTop: 10 }}>{result}</p>}
    </div>
  );
}
