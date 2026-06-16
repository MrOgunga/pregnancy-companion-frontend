"use client";
import { useState } from "react";

type S = {
  premium_price: string;
  ai_model: string;
  weekly_send_day: string;
  journal_enabled: boolean;
  tools_enabled: boolean;
  chat_enabled: boolean;
};

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function AdminSettings({ settings, envModel }: { settings: S; envModel: string }) {
  const [s, setS] = useState<S>(settings);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof S>(k: K, v: S[K]) => {
    setS((cur) => ({ ...cur, [k]: v }));
    setSaved(false);
  };

  async function save() {
    setBusy(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    setBusy(false);
    setSaved(true);
  }

  const toggle = (k: keyof S, label: string, desc: string) => (
    <label style={{ display: "flex", gap: 12, alignItems: "flex-start", textTransform: "none", letterSpacing: 0, cursor: "pointer", marginBottom: 14 }}>
      <input type="checkbox" checked={s[k] as boolean} onChange={(e) => set(k, e.target.checked as S[typeof k])} style={{ width: 18, height: 18, marginTop: 2 }} />
      <span>
        <span style={{ fontSize: 14, color: "var(--ink)" }}>{label}</span>
        <br />
        <span className="muted" style={{ fontSize: 12 }}>{desc}</span>
      </span>
    </label>
  );

  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <div className="fg">
        <label>Premium price (display)</label>
        <input value={s.premium_price} onChange={(e) => set("premium_price", e.target.value)} placeholder="₦2,500" />
      </div>
      <div className="fg">
        <label>AI model override</label>
        <input value={s.ai_model} onChange={(e) => set("ai_model", e.target.value)} placeholder={`default: ${envModel}`} />
        <p className="muted" style={{ fontSize: 11, marginTop: 6 }}>Any NVIDIA NIM model id. Leave blank to use the env default.</p>
      </div>
      <div className="fg">
        <label>Weekly send day</label>
        <select value={s.weekly_send_day} onChange={(e) => set("weekly_send_day", e.target.value)}>
          {DAYS.map((d) => (
            <option key={d} value={d}>{d[0].toUpperCase() + d.slice(1)}</option>
          ))}
        </select>
      </div>

      <label style={{ marginTop: 8 }}>Features</label>
      <div style={{ marginTop: 10 }}>
        {toggle("journal_enabled", "Journal", "Daily mood & symptom check-ins.")}
        {toggle("tools_enabled", "Pregnancy tools", "Kick counter & contraction timer.")}
        {toggle("chat_enabled", "AI chat", "One-on-one chat with Bumply (premium).")}
      </div>

      <button className="f-submit" style={{ maxWidth: 200 }} onClick={save} disabled={busy}>
        {busy ? "Saving…" : "Save settings"}
      </button>
      {saved && <p className="muted" style={{ marginTop: 10, color: "var(--sage)" }}>✓ Saved.</p>}
    </div>
  );
}
