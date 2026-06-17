"use client";
import { useState } from "react";
import { FOCUS_TOPICS, type Prefs } from "@/lib/personalize";
import { normalizeLang } from "@/lib/languages";
import { t } from "@/lib/i18n";

export default function PreferencesForm({ prefs, lang }: { prefs: Prefs; lang?: string | null }) {
  const L = normalizeLang(lang);
  const [tone, setTone] = useState<string>(prefs.tone || "warm");
  const [focus, setFocus] = useState<string[]>(prefs.focus || []);
  const [about, setAbout] = useState<string>(prefs.about || "");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggle(f: string) {
    setFocus((c) => (c.includes(f) ? c.filter((x) => x !== f) : [...c, f]));
    setSaved(false);
  }
  async function save() {
    setBusy(true);
    setSaved(false);
    await fetch("/api/account/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tone, focus, about }),
    });
    setBusy(false);
    setSaved(true);
  }

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <p className="s-label">{t("account.personalise", L)}</p>
      <p className="muted" style={{ marginBottom: 16 }}>{t("account.personaliseSub", L)}</p>

      <div className="fg">
        <label>{t("account.tone", L)}</label>
        <select value={tone} onChange={(e) => { setTone(e.target.value); setSaved(false); }}>
          <option value="warm">{t("tone.warm", L)}</option>
          <option value="concise">{t("tone.concise", L)}</option>
          <option value="detailed">{t("tone.detailed", L)}</option>
        </select>
      </div>

      <label>{t("account.focus", L)}</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0 18px" }}>
        {FOCUS_TOPICS.map((f) => (
          <button
            key={f}
            onClick={() => toggle(f)}
            className="chip"
            style={{ cursor: "pointer", background: focus.includes(f) ? "var(--lavender)" : "white", color: focus.includes(f) ? "white" : "var(--ink-mid)", borderColor: focus.includes(f) ? "var(--lavender)" : "var(--border)" }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="fg">
        <label>{t("account.about", L)}</label>
        <textarea value={about} onChange={(e) => { setAbout(e.target.value); setSaved(false); }} rows={3} maxLength={400} placeholder={t("account.aboutPlaceholder", L)} style={{ resize: "vertical" }} />
      </div>

      <button className="f-submit" style={{ maxWidth: 200 }} onClick={save} disabled={busy}>
        {busy ? t("common.saving", L) : t("common.save", L)}
      </button>
      {saved && <p className="muted" style={{ marginTop: 10, color: "var(--sage)" }}>{t("account.saved", L)}</p>}
    </div>
  );
}
