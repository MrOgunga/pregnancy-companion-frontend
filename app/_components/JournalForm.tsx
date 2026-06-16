"use client";
import { useState } from "react";

const MOODS = [
  { key: "great", emoji: "😄", label: "Great" },
  { key: "good", emoji: "🙂", label: "Good" },
  { key: "okay", emoji: "😐", label: "Okay" },
  { key: "low", emoji: "😔", label: "Low" },
  { key: "rough", emoji: "😣", label: "Rough" },
];

const SYMPTOMS = [
  "Nausea", "Fatigue", "Headache", "Back pain", "Cramps", "Heartburn",
  "Swelling", "Trouble sleeping", "Cravings", "Mood swings", "Dizziness", "Constipation",
];

export default function JournalForm() {
  const [mood, setMood] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  function toggle(s: string) {
    setSymptoms((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }

  async function save() {
    if (!mood && symptoms.length === 0 && !note.trim()) return;
    setBusy(true);
    await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, symptoms, note }),
    });
    window.location.reload();
  }

  return (
    <div className="card" style={{ marginBottom: 28 }}>
      <p className="s-label">Today&apos;s check-in</p>
      <h3 className="feat-title" style={{ marginBottom: 16 }}>How are you feeling?</h3>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {MOODS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMood(m.key)}
            className="card"
            style={{
              padding: "12px 14px", textAlign: "center", cursor: "pointer", minWidth: 72,
              border: mood === m.key ? "2px solid var(--pink)" : "1px solid var(--border)",
              background: mood === m.key ? "var(--pink-pale)" : "white",
            }}
          >
            <div style={{ fontSize: 26 }}>{m.emoji}</div>
            <div className="muted" style={{ fontSize: 11 }}>{m.label}</div>
          </button>
        ))}
      </div>

      <label>Any symptoms today?</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0 20px" }}>
        {SYMPTOMS.map((s) => (
          <button
            key={s}
            onClick={() => toggle(s)}
            className="chip"
            style={{ cursor: "pointer", background: symptoms.includes(s) ? "var(--lavender)" : "white", color: symptoms.includes(s) ? "white" : "var(--ink-mid)", borderColor: symptoms.includes(s) ? "var(--lavender)" : "var(--border)" }}
          >
            {s}
          </button>
        ))}
      </div>

      <label>Anything you want to remember?</label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="A note to your future self…"
        rows={3}
        style={{ marginTop: 8, marginBottom: 16, resize: "vertical" }}
      />

      <button className="f-submit" style={{ maxWidth: 220 }} onClick={save} disabled={busy}>
        {busy ? "Saving…" : "Save today's entry 🌸"}
      </button>
    </div>
  );
}
