"use client";
import { useState } from "react";
import { normalizeLang } from "@/lib/languages";
import { t } from "@/lib/i18n";

const MOODS = [
  { key: "great", emoji: "😄" },
  { key: "good", emoji: "🙂" },
  { key: "okay", emoji: "😐" },
  { key: "low", emoji: "😔" },
  { key: "rough", emoji: "😣" },
];

const SYMPTOMS = [
  "Nausea", "Fatigue", "Headache", "Back pain", "Cramps", "Heartburn",
  "Swelling", "Trouble sleeping", "Cravings", "Mood swings", "Dizziness", "Constipation",
];

export default function JournalForm({ lang }: { lang?: string | null }) {
  const L = normalizeLang(lang);
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
      <p className="s-label">{t("journal.today", L)}</p>
      <h3 className="feat-title" style={{ marginBottom: 16 }}>{t("journal.howfeeling", L)}</h3>

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
            <div className="muted" style={{ fontSize: 11 }}>{t(`mood.${m.key}`, L)}</div>
          </button>
        ))}
      </div>

      <label>{t("journal.symptomsq", L)}</label>
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

      <label>{t("journal.rememberq", L)}</label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={t("journal.placeholder", L)}
        rows={3}
        style={{ marginTop: 8, marginBottom: 16, resize: "vertical" }}
      />

      <button className="f-submit" style={{ maxWidth: 220 }} onClick={save} disabled={busy}>
        {busy ? t("common.saving", L) : t("journal.save", L)}
      </button>
    </div>
  );
}
