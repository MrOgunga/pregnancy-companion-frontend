"use client";
import { useState } from "react";
import { VITAL_KINDS } from "@/lib/vitals";

export default function VitalsForm() {
  const [kind, setKind] = useState("bp");
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState<{ level: string; message: string } | null>(null);
  const [err, setErr] = useState("");

  const meta = VITAL_KINDS.find((v) => v.kind === kind)!;

  async function save() {
    if (!value) return;
    setBusy(true);
    setAlert(null);
    setErr("");
    const res = await fetch("/api/vitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, value, value2, note }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(data.error || "Could not save."); return; }
    if (data.alert) setAlert(data.alert); // show it; mom taps "Got it" to continue
    else window.location.reload();
  }

  if (alert) {
    const urgent = alert.level === "urgent";
    return (
      <div className="card" style={{ marginBottom: 28, border: `1px solid ${urgent ? "var(--pink)" : "var(--gold)"}`, background: urgent ? "var(--pink-pale)" : "var(--gold-lt)" }}>
        <h3 className="feat-title" style={{ marginBottom: 8 }}>{urgent ? "🚨 Please act now" : "⚠️ Worth checking"}</h3>
        <p style={{ marginBottom: 16 }}>{alert.message}</p>
        <p className="muted" style={{ fontSize: 12, marginBottom: 16 }}>This is information, not a diagnosis. We&apos;ve also sent this to your notifications.</p>
        <button className="f-submit" style={{ maxWidth: 160 }} onClick={() => window.location.reload()}>Got it</button>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: 28 }}>
      <p className="s-label">Log a reading</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "10px 0 18px" }}>
        {VITAL_KINDS.map((v) => (
          <button
            key={v.kind}
            onClick={() => { setKind(v.kind); setValue(""); setValue2(""); }}
            className="chip"
            style={{ cursor: "pointer", background: kind === v.kind ? "var(--pink)" : "white", color: kind === v.kind ? "white" : "var(--ink-mid)", borderColor: kind === v.kind ? "var(--pink)" : "var(--border)" }}
          >
            {v.emoji} {v.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div className="fg" style={{ margin: 0, flex: "1 1 120px" }}>
          <label>{meta.dual ? meta.fields![0] : meta.label} {meta.unit ? `(${meta.unit})` : ""}</label>
          <input type="number" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder={meta.hint || ""} />
        </div>
        {meta.dual && (
          <div className="fg" style={{ margin: 0, flex: "1 1 120px" }}>
            <label>{meta.fields![1]}</label>
            <input type="number" inputMode="decimal" value={value2} onChange={(e) => setValue2(e.target.value)} />
          </div>
        )}
      </div>

      <div className="fg" style={{ marginTop: 12 }}>
        <label>Note (optional)</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="how you're feeling, where you measured…" />
      </div>

      <button className="f-submit" style={{ maxWidth: 200 }} onClick={save} disabled={busy || !value}>
        {busy ? "Saving…" : "Save reading 🌸"}
      </button>
      {err && <p className="f-error">{err}</p>}
    </div>
  );
}
